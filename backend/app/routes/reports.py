from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app import models, dbm
from app.routes.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])


# ---------------- MONTHLY SUMMARY ----------------
@router.get("/summary")
def monthly_summary(db: Session = Depends(dbm.get_db), current_user: models.User = Depends(get_current_user)):
    today = date.today()
    month = today.month
    year = today.year

    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.date >= date(year, month, 1),
        models.Transaction.date <= today
    ).all()

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")

    return {
        "month": today.strftime("%B %Y"),
        "total_income": total_income,
        "total_expense": total_expense,
        "net_savings": total_income - total_expense
    }


# ---------------- CATEGORY BREAKDOWN ----------------
@router.get("/categories")
def category_breakdown(db: Session = Depends(dbm.get_db), current_user: models.User = Depends(get_current_user)):
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id).all()

    breakdown = {}
    for t in transactions:
        if t.type == "expense":
            breakdown[t.category] = breakdown.get(t.category, 0) + t.amount

    return {"category_expenses": breakdown}


# ---------------- GOALS PROGRESS ----------------
@router.get("/goals-progress")
def goals_progress(db: Session = Depends(dbm.get_db), current_user: models.User = Depends(get_current_user)):
    goals = db.query(models.Goal).filter(models.Goal.user_id == current_user.id).all()
    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.type == "income"
    ).all()

    total_savings = sum(t.amount for t in transactions)

    progress = []
    for goal in goals:
        percent = min(100, (total_savings / goal.target_amount) * 100) if goal.target_amount > 0 else 0
        progress.append({
            "goal_id": goal.id,
            "target_amount": goal.target_amount,
            "deadline": goal.deadline,
            "progress_percent": round(percent, 2)
        })

    return {"goals_progress": progress}
