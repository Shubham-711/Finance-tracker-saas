from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta, date
from app import models, dbm
from app.routes.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary")
def monthly_summary(db: Session = Depends(dbm.get_db), current_user: models.User = Depends(get_current_user)):
    print("\n--- [DEBUG] Fetching /reports/summary ---") # DEBUG LINE
    today = date.today()
    start_of_month = date(today.year, today.month, 1)
    
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.date >= start_of_month
    ).all()

    # DEBUG: Print exactly what the database returned
    for t in transactions:
        print(f"[DEBUG] Transaction ID: {t.id}, Amount: {t.amount}, Type: {t.transaction_type}")

    # Correct calculation logic
    total_income = sum(t.amount for t in transactions if t.transaction_type == "income")
    total_expense = sum(t.amount for t in transactions if t.transaction_type == "expense")

    print(f"[DEBUG] Calculated Income: {total_income}, Calculated Expense: {total_expense}\n") # DEBUG LINE

    return {
        "month": today.strftime("%B %Y"),
        "total_income": total_income,
        "total_expense": total_expense,
    }


@router.get("/categories")
def category_breakdown(
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Return expense breakdown by category for the logged-in user."""
    transactions = (
        db.query(
            models.Transaction.category,
            func.sum(models.Transaction.amount).label("total")
        )
        .filter(
            models.Transaction.user_id == current_user.id,
            func.lower(models.Transaction.transaction_type) == "expense",
        )
        .group_by(models.Transaction.category)
        .all()
    )

    breakdown = {category: total for category, total in transactions}
    return {"category_expenses": breakdown}


@router.get("/trends")
def get_daily_trends(
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Return income vs expense trends for the last 30 days."""
    today = date.today()
    thirty_days_ago = today - timedelta(days=30)

    # Expense trend
    expenses = (
        db.query(
            models.Transaction.date,
            func.sum(models.Transaction.amount).label("daily_total")
        )
        .filter(
            models.Transaction.user_id == current_user.id,
            func.lower(models.Transaction.transaction_type) == "expense",
            models.Transaction.date.between(thirty_days_ago, today),
        )
        .group_by(models.Transaction.date)
        .all()
    )

    # Income trend
    income = (
        db.query(
            models.Transaction.date,
            func.sum(models.Transaction.amount).label("daily_total")
        )
        .filter(
            models.Transaction.user_id == current_user.id,
            func.lower(models.Transaction.transaction_type) == "income",
            models.Transaction.date.between(thirty_days_ago, today),
        )
        .group_by(models.Transaction.date)
        .all()
    )

    expense_map = {e.date.isoformat(): e.daily_total for e in expenses}
    income_map = {i.date.isoformat(): i.daily_total for i in income}

    labels = [(today - timedelta(days=i)).isoformat() for i in range(29, -1, -1)]

    return {
        "labels": labels,
        "expense_data": [expense_map.get(label, 0) for label in labels],
        "income_data": [income_map.get(label, 0) for label in labels],
    }
