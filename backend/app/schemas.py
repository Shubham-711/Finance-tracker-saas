from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List


# ------------------ USER ------------------
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        orm_mode = True


# ------------------ TRANSACTIONS ------------------
class TransactionBase(BaseModel):
    type: str
    category: str
    amount: float
    date: date
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True


# ------------------ GOALS ------------------
class GoalBase(BaseModel):
    target_amount: float
    deadline: date

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True
