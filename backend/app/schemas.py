from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List

# ---------------- AUTH ----------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


# ---------------- TRANSACTIONS ----------------
class TransactionBase(BaseModel):
    type: str
    category: str
    amount: float
    date: date
    description: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[date] = None
    description: Optional[str] = None


class TransactionResponse(TransactionBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


# ---------------- GOALS ----------------
class GoalBase(BaseModel):
    target_amount: float
    current_amount: float = 0.0
    deadline: date


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[date] = None


class GoalResponse(GoalBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
