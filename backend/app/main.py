from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app import dbm, models
from app.routes import auth

app = FastAPI(title="Finance Tracker API")

# Root test route
@app.get("/")
def root():
    return {"message": "Finance Tracker API is running 🚀"}

# DB connectivity check
@app.get("/ping-db")
def ping_db(db: Session = Depends(dbm.get_db)):
    try:
        db.execute("SELECT 1")
        return {"status": "DB connection OK"}
    except Exception as e:
        return {"status": "DB connection failed", "error": str(e)}

# Auto-create tables on startup
@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=dbm.engine)

app.include_router(auth.router)