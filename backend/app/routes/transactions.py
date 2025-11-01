from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, dbm
from app.routes.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])


# ✅ Create transaction
@router.post("", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user),
):
    data = transaction.dict()

    # Normalize type to lowercase
    data["transaction_type"] = data["transaction_type"].strip().lower()
    data["category"] = data["category"].strip().lower()
    data["user_id"] = current_user.id

    # Optional: Validation
    if data["transaction_type"] not in ["income", "expense"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    new_transaction = models.Transaction(**data)
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


# ✅ Get all transactions
@router.get("", response_model=List[schemas.TransactionResponse])
def get_transactions(
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Transaction)
        .filter(models.Transaction.user_id == current_user.id)
        .order_by(models.Transaction.date.desc())
        .all()
    )


# ✅ Get single transaction
@router.get("/{transaction_id}", response_model=schemas.TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user),
):
    transaction = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.id == transaction_id,
            models.Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return transaction


# ✅ Delete transaction
@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user),
):
    transaction = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.id == transaction_id,
            models.Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted successfully"}


# ✅ Update transaction
@router.put("/{transaction_id}", response_model=schemas.TransactionResponse)
def update_transaction(
    transaction_id: int,
    updated_data: schemas.TransactionCreate,
    db: Session = Depends(dbm.get_db),
    current_user: models.User = Depends(get_current_user),
):
    transaction = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.id == transaction_id,
            models.Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    update_dict = updated_data.dict()
    if "transaction_type" in update_dict:
        update_dict["transaction_type"] = update_dict["transaction_type"].strip().lower()
    if "category" in update_dict:
        update_dict["category"] = update_dict["category"].strip().lower()

    # Optional validation
    if update_dict.get("transaction_type") not in [None, "income", "expense"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    for key, value in update_dict.items():
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)
    return transaction
