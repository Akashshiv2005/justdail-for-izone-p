BizDial - Enterprise B2B Directory & Local Search Platform

BizDial is a high-performance local search engine and B2B directory platform designed to connect consumers with highly rated local businesses. The platform includes a robust Super Admin dashboard with a full location hierarchy manager and a Programmatic SEO Engine for dominating local search rankings, plus a full-featured Business Owner portal for profile, catalog, lead, and analytics management.

🚀 Features
Public Platform
Local Search & Discovery: Full-text business search with suggestions, popular searches, and category/subcategory browsing.
Location-Aware Results: Hierarchical location resolution (Country → State → District → City → Area) used to power "near me" style search and SEO landing pages.
Business Detail Pages: Rich profile pages with products, services, gallery, ratings/reviews, and contact details.
Enterprise Registration + OTP Verification: Self-service business signup flow with OTP-based phone/email verification and document upload for admin review.
Business Owner Dashboard
Profile Management: Contact info, category, and business profile editing.
Catalog Management: Products, services (mapped to master services), and gallery photos.
Lead Management: Track and update incoming customer leads.
Staff & Promotions: Manage staff roles and run promotional offers.
Invoices & Stats: View billing/invoice history and business performance stats.
Platform Feedback: Submit reviews and testimonials about the BizDial platform directly to admins.
Super Admin Dashboard
Business Management & Approvals: Review, approve/reject, and manage all business listings and registrations.
Category & Subcategory Manager: Full CRUD over the platform taxonomy (currently seeded with 40 top-level categories, up from an earlier set of 29).
Location Manager: CRUD for countries, states, districts, cities, and areas, plus bulk export and stats.
Verification Center: Review uploaded business documents and approve/reject enterprise registrations, with a full audit log.
Search Config Manager: Tune search ranking/config and inspect recent searches.
Programmatic SEO Engine:
Global Keywords Manager: Inject high-intent keywords across categories, cities, and businesses dynamically.
Business SEO Override: Hand-craft custom titles, descriptions, and slugs for premium clients.
Redirects & Templates: Manage SEO redirects and per-target-type SEO templates.
Auto-generated Sitemaps & Robots.txt: Dedicated sitemap endpoints for static pages, categories, locations (state/district/city/area), and businesses.
Reviews, Customers, and Logs: Moderate business reviews, platform testimonials, manage customer accounts, and inspect admin activity logs.
Architecture
Frontend: React 19 (Vite), TypeScript, Tailwind CSS v4, React Router, Recharts, Leaflet/React-Leaflet, Framer Motion, Lucide Icons.
Backend: FastAPI (Python), SQLAlchemy 2.x, PostgreSQL (via psycopg2), Alembic migrations, JWT auth (PyJWT + Passlib/Bcrypt).

Note: This project connects to PostgreSQL only — there is no SQLite fallback. Make sure a Postgres server is running and reachable before starting the backend.

🛠️ Complete Setup & Run Guide

Follow these steps to get the project up and running locally from scratch.

0. Prerequisites
Python 3.10+
Node.js 18+ and npm
A running PostgreSQL instance (local or remote)
1. Backend Setup (FastAPI & Python)

First, set up your Python environment and start the backend server. Open a terminal and run the following commands:

bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
py -m venv venv

# Activate the virtual environment (Windows)
venv\Scripts\activate
# For Mac/Linux use: source venv/bin/activate

# Install all required Python dependencies
pip install -r requirements.txt

# 3. Create the Database Schema
# Start the server once to automatically create the 'bizdial' schema in Postgres
python -m uvicorn app.main:app  --reload --port 8000
# (Press CTRL+C after you see "Application startup complete")

# 4. Run Alembic migrations to create/update database tables
alembic upgrade head

# 5. Seed the database with master categories and subcategories (40 categories)
python seed_categories.py

# Seed the database with default admin and owner users
python seed_users.py

# Seed the database with sample businesses, products, services, and SEO data
python master_seed.py

# Start the FastAPI server (runs on port 8000)
python -m uvicorn app.main:app --reload --port 8000

Note on DATABASE_URL: If your Postgres password contains special characters (like @), percent-encode them in the connection string (e.g. @ → %40), or the URL will fail to parse.

Note on Database Migrations: This project uses Alembic for database schema management. If you modify any SQLAlchemy models in backend/models, generate a new migration script using alembic revision --autogenerate -m "your message" and apply it with alembic upgrade head.

Note: The backend API will be available at http://127.0.0.1:8000. You can view the interactive API documentation at http://127.0.0.1:8000/docs.

2. Frontend Setup (React & Vite)

Next, open a new terminal window (keep the backend server running in the first one) to start the frontend interface:

bash
# Navigate to the frontend directory
cd frontend

# Install all Node modules and dependencies
npm install

# Copy the frontend environment file
cp .env.example .env   # on Windows: copy .env.example .env

# Start the Vite development server
npm run dev

Note: The frontend application will be available at http://localhost:5173, and reads its API base URL from VITE_API_URL (see .env).

🔐 Default Login Credentials

After successfully setting up both the frontend and backend (and running seed_users.py), you can log in to the different portals using the following demo credentials:

Super Admin Portal
URL: http://localhost:5173/login
Email: admin@justdial.com
Password: admin123
Business Owner Portal
URL: http://localhost:5173/login
Email: owner@justdial.com
Password: owner123
📂 Project Structure
justdail-for-izone-p/
│
├── backend/                    FastAPI + Python — server & database logic
│   ├── models/                 SQLAlchemy models (Business, Category, Subcategory,
│   │                            User, Location hierarchy, Testimonial, Brand,
│   │                            Verification, SearchConfig, MasterService, etc.)
│   ├── routes/                 API endpoints, grouped by domain:
│   │   ├── search.py            Public search, suggestions, business detail
│   │   ├── homepage.py          Homepage feed & categories
│   │   ├── auth.py              Register / login
│   │   ├── owner.py             Owner dashboard (profile, products, services,
│   │   │                         leads, gallery, staff, promotions, invoices)
│   │   ├── admin.py             Super admin: businesses, reviews, customers,
│   │   │                         leads, stats, logs
│   │   ├── admin_category.py    Category / subcategory / master-service CRUD
│   │   ├── location_routes.py   Location hierarchy CRUD + location sitemaps
│   │   ├── search_admin.py      Search config management
│   │   ├── seo.py               SEO keywords, redirects, templates, sitemaps
│   │   └── verification.py      OTP, enterprise registration, doc verification
│   ├── seo_engine/              Ranking, schema, and template helpers for SEO
│   ├── verification_engine/     Duplicate checks & listing quality scoring
│   ├── alembic/                 Database migration scripts
│   ├── seed_categories.py       Seeds the 40-category taxonomy
│   ├── seed_users.py            Seeds default admin & owner accounts
│   ├── master_seed.py           Seeds sample businesses, products, services, SEO data
│   ├── database.py              PostgreSQL engine/session setup
│   └── main.py                  FastAPI app entrypoint & router registration
│
├── frontend/                   React (Vite + TypeScript) — everything the user sees
│   └── src/
│       ├── pages/                The actual screens
│       │   ├── Home.tsx                    → Public homepage
│       │   ├── CategoryPage.tsx            → "Restaurants near me" type pages
│       │   ├── SubcategoryPage.tsx         → Subcategory listing pages
│       │   ├── SearchResults.tsx           → Search results page
│       │   ├── BusinessDetail.tsx          → One business's page
│       │   ├── LandingPage.tsx             → Marketing landing page
│       │   ├── Login.tsx / Register.tsx    → Auth screens
│       │   ├── EnterpriseRegister.tsx      → Business signup + OTP verification
│       │   ├── super-admin/                → Admin Dashboard (whole platform)
│       │   │   ├── seo/                     SEO Engine screens
│       │   │   └── verification/            Verification review screens
│       │   └── dashboard/owner/            → Owner Dashboard (one business)
│       ├── components/           Reusable pieces (common/, dashboard/, home/)
│       └── lib/
│           ├── services/api.ts    Axios client (reads VITE_API_URL, attaches JWT)
│           ├── hooks/              useGeolocation, useHomeData
│           └── context/            Auth & Location React contexts
│
├── docs/                        Flow diagrams and dev-environment notes
└── .env.example                 Template for DATABASE_URL, SECRET_KEY, VITE_API_URL
/backend/uploads - Static file storage for uploaded images/documents, served at /uploads.
🔌 API Overview

All endpoints are served under the FastAPI app and documented interactively at /docs. Highlights:

Area	Base path	Examples
Auth	/api/auth	register, login, send-otp, verify-otp, register-enterprise
Search	/api/search, /api/homepage	search, search/suggestions, search/popular, business/{slug}
Owner	/api/owner/{business_id}	profile, products, services, master-services, leads, gallery, staff, promotions, invoices, stats
Admin	/api/admin	business-management, business-approvals, categories, locations, reviews, customers, leads, stats, logs
Categories	/api/admin/categories, /subcategories, /services	Full CRUD for taxonomy
Locations	/api/location, /api/admin/locations	Hierarchy resolution + admin CRUD for countries/states/districts/cities/areas
SEO	/api/admin/seo, /sitemap*.xml, /robots.txt	Keywords, redirects, templates, dashboard, analytics, sitemaps
Verification	/api/admin/verification	List pending docs, approve documents
🧪 Verifying the Project Runs
Confirm Postgres is reachable and DATABASE_URL in .env is correct.
cd backend && python -m uvicorn main:app --reload --port 8000 — visit http://127.0.0.1:8000/ and /docs to confirm the API is live.
cd frontend && npm run dev — visit http://localhost:5173 to confirm the UI loads and can reach the API (check the Network tab for successful /api/* calls).
Log in with the seeded admin/owner credentials above to verify both dashboards load.