from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List


# ---------------- AUTH ----------------
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str

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

class Token(BaseModel):
    access_token: str
    token_type: str

# ------------------ TOKEN ------------------
class Token(BaseModel):
    access_token: str
    token_type: str
