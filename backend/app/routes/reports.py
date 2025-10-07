from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract 
from datetime import datetime , timedelta , date
from app import models, dbm 
from app.routes.auth import get_current_user
 
router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary")
async def get_summary(db: Session = Depends(dbm.get_db)):
    now = datetime.now()
    year, month = now.year, now.month

    total_income = (
        db.query(func.sum(models.Transaction.amount))
        .filter(
            models.Transaction.type == "income",
            extract("year", models.Transaction.date) == year,
            extract("month", models.Transaction.date) == month,
        )
        .scalar()
        or 0
    )

    total_expense = (
        db.query(func.sum(models.Transaction.amount))
        .filter(
            models.Transaction.type == "expense",
            extract("year", models.Transaction.date) == year,
            extract("month", models.Transaction.date) == month,
        )
        .scalar()
        or 0
    )

    return {
        "month": now.strftime("%B %Y"),
        "total_income": float(total_income),
        "total_expense": float(total_expense),
    }

@router.get("/categories")
def category_breakdown(
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user)
):
    transactions = db.query(
        models.Transaction.category,
        func.sum(models.Transaction.amount).label("total")
    ). filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == "expense",
        func.lower(models.Transaction.type) == "expense",
    ).group_by(models.Transaction.category).all()

    breakdown = {category: total for category, total in transactions}
    return {"category_expenses": breakdown}


@router.get("/trends")
def get_daily_trends(
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user)
):
    today = date.today()
    thirty_days_ago = today - timedelta(days=30)

    # Expenses query
    expenses = db.query(
        models.Transaction.date,
        func.sum(models.Transaction.amount).label("daily_total")
    ).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == "expense",
        func.lower(models.Transaction.type) == "expense",
        models.Transaction.date.between(thirty_days_ago, today)
    ).group_by(models.Transaction.date).all()

    # Income query
    income = db.query(
        models.Transaction.date,
        func.sum(models.Transaction.amount).label("daily_total")
    ).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == "income",
        func.lower(models.Transaction.type) == "income",
        models.Transaction.date.between(thirty_days_ago, today)
    ).group_by(models.Transaction.date).all()

    expense_map = {e.date.isoformat(): e.daily_total for e in expenses}
    income_map = {i.date.isoformat(): i.daily_total for i in income}

    labels = [
        (today - timedelta(days=i)).isoformat()
        for i in range(29, -1, -1)
    ]

    return {
        "labels": labels,
        "expense_data": [expense_map.get(label, 0) for label in labels],
        "income_data": [income_map.get(label, 0) for label in labels]
    }
