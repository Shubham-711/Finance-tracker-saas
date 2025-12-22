# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
from app import dbm, models
from app.routes import auth, transactions, goals, reports
# import routers
from app.routes import auth, transactions, goals, reports  # make sure these files exist

app = FastAPI(title="Finance Tracker API", version="1.0")

# CORS config - restrict to dev hosts (do NOT keep "*" in production)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",    # add other dev ports if needed
    "http://127.0.0.1:5174",
]

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Allows your frontend to talk to backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# dependency helper (used by some endpoints)
def get_db():
    db = dbm.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Finance Tracker API running 🚀"}

# Example route (you can keep your reports router's endpoints instead)
@app.on_event("startup")
def on_startup():
    # create tables if necessary
    models.Base.metadata.create_all(bind=dbm.engine)

# --- include routers (IMPORTANT) ---
# Note: your routers (auth.router etc.) already define prefix="/auth" or similar
app.include_router(auth.router)          # registers /auth/*
app.include_router(transactions.router)  # registers /transactions/*
app.include_router(goals.router)         # registers /goals/*
app.include_router(reports.router)       # registers /reports/*

# run directly if needed
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
