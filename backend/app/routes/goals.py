from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, dbm
from app.routes.auth import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])


# ---------------- CREATE GOAL ----------------
@router.post("", response_model=schemas.GoalResponse)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(dbm.get_db), current_user: models.User = Depends(get_current_user)):
    new_goal = models.Goal(
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        deadline=goal.deadline,
        user_id=current_user.id
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


# ---------------- LIST GOALS ----------------
@router.get("", response_model=List[schemas.GoalResponse])
def get_goals(db: Session = Depends(dbm.get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Goal).filter(models.Goal.user_id == current_user.id).all()


# ---------------- UPDATE GOAL ----------------
@router.put("/{goal_id}", response_model=schemas.GoalResponse)
def update_goal(
    goal_id: int, 
    updated: schemas.GoalCreate, 
    db: Session = Depends(dbm.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id, models.Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.target_amount = updated.target_amount
    goal.current_amount = updated.current_amount
    goal.deadline = updated.deadline
    
    db.commit()
    db.refresh(goal)
    return goal


# ---------------- DELETE GOAL ----------------
@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(dbm.get_db), current_user: models.User = Depends(get_current_user)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id, models.Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()
    return {"detail": "Goal deleted successfully"}
