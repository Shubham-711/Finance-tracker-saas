# 💰 Personal Finance Tracker SaaS

![Python](https://img.shields.io/badge/Python-3.10-blue) ![React](https://img.shields.io/badge/React-18-61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)

A full-stack financial management app to track income/expenses in real-time. Built with **FastAPI**, **React**, and **PostgreSQL**.

## 🚀 Live Demo

| Component | Link |
| :--- | :--- |
| **Frontend (App)** | [**👉 Open Live App**](https://finance-tracker-saas-rho.vercel.app/) |
| **Backend (Docs)** | [**👉 View API Docs**](https://finance-tracker-saas-1.onrender.com/docs) |

---

## 🎥 Project Demo
Here is a walkthrough of the application:

<video src="https://github.com/user-attachments/assets/0b32c2b0-8f0f-4f33-86ca-7c9703866cc0" controls="controls" style="max-width: 100%;">
</video>

---

## ✨ Features

* 🔐 **JWT Auth:** Secure Signup & Login with password hashing.
* 💸 **Transactions:** Add, Edit, Delete income and expenses.
* 📊 **Real-time Stats:** Automatic calculation of balance and totals.
* ☁️ **Cloud DB:** Data persists in PostgreSQL (Neon Tech).

---

## 🛠️ Tech Stack

* **Backend:** Python 3.10, FastAPI, SQLAlchemy, PostgreSQL, Passlib
* **Frontend:** React (Vite), TypeScript, Axios, Tailwind CSS
* **Deployment:** Render (Backend), Vercel (Frontend)

---

## ⚙️ Installation (Run Locally)

### 1. Clone & Setup Backend

First, clone the project and navigate to the backend folder:

```
git clone https://github.com/Shubham-711/Finance-tracker-saas.git
cd Finance-tracker-saas/backend
Create a virtual environment:

python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
Install dependencies:

pip install -r requirements.txt
Create a .env file in the backend folder:

DATABASE_URL=postgresql://neondb_owner:YOUR_PASS@ep-holy-cloud.neon.tech/neondb
JWT_SECRET=your_super_secret_key
Run the Server:

uvicorn app.main:app --reload
(Server runs at http://127.0.0.1:8000)

2. Setup Frontend
Open a new terminal and go to the frontend folder:

cd ../frontend
npm install
Create a .env file in the frontend folder:

VITE_API_BASE_URL=http://127.0.0.1:8000
Run App:npm run dev
(App runs at http://localhost:5173)


📡 API EndpointsMethodEndpointDescription
POST/auth/signupRegister new user
POST/auth/loginGet Access Token
GET/transactions/Fetch user data
POST/transactions/Create transaction
DELETE/transactions/{id}Remove transaction
