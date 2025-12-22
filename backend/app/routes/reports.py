from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, and_
from datetime import datetime, timedelta, date
from app import models, dbm
from app.routes.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])

# --- HELPER FUNCTIONS (New) ---

def get_month_dates(year: int, month: int):
    """Returns the start and end date for a given month."""
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = date(year, month + 1, 1) - timedelta(days=1)
    return start_date, end_date

def calculate_change(current: float, previous: float) -> float:
    """Calculates percentage change safely."""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return ((current - previous) / previous) * 100.0

def get_sum(db: Session, user_id: int, start_date: date, end_date: date, tx_type: str = None) -> float:
    """Sum transactions for a specific period and optional type."""
    query = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.date >= start_date,
        models.Transaction.date <= end_date
    )
    if tx_type:
        query = query.filter(models.Transaction.transaction_type == tx_type)
    
    result = query.scalar()
    return result or 0.0


# --- REPLACED ENDPOINT (Renamed to match React code) ---

@router.get("/dashboard-stats") 
def get_dashboard_stats(
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user),
):
    today = date.today()
    
    # 1. Define Time Ranges
    # Current Month
    curr_start, curr_end = get_month_dates(today.year, today.month)
    
    # Previous Month (Handle January case)
    prev_month = today.month - 1 if today.month > 1 else 12
    prev_year = today.year if today.month > 1 else today.year - 1
    prev_start, prev_end = get_month_dates(prev_year, prev_month)

    # 2. Fetch Data (Current Month)
    curr_income = get_sum(db, current_user.id, curr_start, curr_end, "income")
    curr_expense = get_sum(db, current_user.id, curr_start, curr_end, "expense")
    curr_savings = curr_income - curr_expense

    # 3. Fetch Data (Previous Month)
    prev_income = get_sum(db, current_user.id, prev_start, prev_end, "income")
    prev_expense = get_sum(db, current_user.id, prev_start, prev_end, "expense")
    prev_savings = prev_income - prev_expense

    # 4. Calculate Total Balance (All-time)
    total_income = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.transaction_type == "income"
    ).scalar() or 0.0

    total_expense = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.transaction_type == "expense"
    ).scalar() or 0.0
    
    total_balance = total_income - total_expense

    # 5. Calculate Percentage Changes
    income_pct = calculate_change(curr_income, prev_income)
    expense_pct = calculate_change(curr_expense, prev_expense)
    savings_pct = calculate_change(curr_savings, prev_savings)
    
    # For Balance Change, we use savings growth as a proxy for this month's performance
    balance_pct = savings_pct 

    return {
        "balance": {
            "amount": total_balance,
            "change": round(balance_pct, 1),
            "isPositive": balance_pct >= 0
        },
        "income": {
            "amount": curr_income,
            "change": round(income_pct, 1),
            "isPositive": income_pct >= 0
        },
        "expenses": {
            "amount": curr_expense,
            "change": round(expense_pct, 1),
            "isPositive": expense_pct <= 0 # Negative change in expense is GOOD (Green)
        },
        "savings": {
            "amount": curr_savings,
            "change": round(savings_pct, 1),
            "isPositive": savings_pct >= 0
        }
    }


# --- EXISTING ENDPOINTS (Kept exactly the same) ---

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