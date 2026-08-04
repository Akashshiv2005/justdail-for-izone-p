# BizDial - Enterprise B2B Directory & Local Search Platform

BizDial is a high-performance local search engine and B2B directory platform designed to connect consumers with highly rated local businesses. The platform includes a robust Super Admin dashboard featuring an advanced Programmatic SEO Engine for dominating local search rankings, and a Business Owner portal for full profile and analytics management.

## 🚀 Features

*   **Super Admin Dashboard:** Complete control over taxonomy, business listings, and enterprise operations.
*   **Business Owner Dashboard:** Empower business owners to manage leads, services, photos, and performance analytics.
*   **Programmatic SEO Engine:**
    *   **Global Keywords Manager:** Inject high-intent keywords across specific categories and cities dynamically.
    *   **Business SEO Override:** Hand-craft custom titles, descriptions, and slugs for premium clients.
*   **Dual-Stack Architecture:**
    *   **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide Icons.
    *   **Backend:** FastAPI (Python), SQLAlchemy, SQLite (with Postgres support).

---

## 🛠️ Complete Setup & Run Guide

Follow these steps to get the project up and running locally from scratch.

### 1. Backend Setup (FastAPI & Python)

First, set up your Python environment and start the backend server. Open a terminal and run the following commands:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
venv\Scripts\activate
# For Mac/Linux use: source venv/bin/activate

# Install all required Python dependencies
pip install -r requirements.txt

# Run Alembic migrations to create/update database tables
alembic upgrade head

# Seed the database with master categories and subcategories
python seed_categories.py

# Seed the database with default admin and owner users
python seed_users_fix.py

# Seed the database with sample businesses, products, services, and SEO data
python master_seed.py

# Start the FastAPI server (runs on port 8000)
python -m uvicorn main:app --reload --port 8000
```

> **Note on Database Migrations:** This project uses Alembic for database schema management. If you modify any SQLAlchemy models in `backend/models`, generate a new migration script using `alembic revision --autogenerate -m "your message"` and apply it with `alembic upgrade head`.

> **Note:** The backend API will be available at `http://127.0.0.1:8000`. You can view the interactive API documentation at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup (React & Vite)

Next, open a **new terminal window** (keep the backend server running in the first one) to start the frontend interface:

```bash
# Navigate to the frontend directory
cd frontend

# Install all Node modules and dependencies
npm install

# Start the Vite development server
npm run dev
```

> **Note:** The frontend application will be available at `http://localhost:5173`. 

---

## 🔐 Default Login Credentials

After successfully setting up both the frontend and backend, you can log in to the different portals using the following demo credentials:

### Super Admin Portal
* **URL:** `http://localhost:5173/login`
* **Email:** `admin@justdial.com`
* **Password:** `admin123`

### Business Owner Portal
* **URL:** `http://localhost:5173/login`
* **Email:** `owner@justdial.com`
* **Password:** `owner123`

---

## 📂 Project Structure

*   `/frontend` - React application containing all UI templates (Customer facing, Super Admin, and Business Owner).
*   `/backend` - FastAPI application handling API routes, database models, and file uploads.
*   `/backend/database.db` - The SQLite database file automatically generated when running the backend server.
