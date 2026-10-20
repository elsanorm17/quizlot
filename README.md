# Quizlot

A starter scaffold for Quizlot, a gamified study and trivia app.

## Stack
- Frontend: React + Vite + JavaScript
- Backend: FastAPI (Python)
- Database: MySQL on Google Cloud SQL
- Hosting direction: frontend on Cloud Run or Firebase Hosting; API on Cloud Run; database on Cloud SQL

## Repository layout
- `frontend/` — React UI and API client
- `backend/` — FastAPI app and MySQL connection setup
- `database/schema.sql` — initial relational schema
- `.env.example` — local environment variables

## Run locally

### 1. Backend
Python 3.11+ recommended.

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

On macOS/Linux, replace `copy .env.example .env` with `cp .env.example .env`.

The API docs are at `http://127.0.0.1:8000/docs`. The API runs in demo mode if database variables are not configured.

### 2. Frontend
In another terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env`. Vite prints the local URL, usually `http://localhost:5173`.

### 3. Database
Create a MySQL database and run `database/schema.sql` against it. For local development, you can use a local MySQL instance; later point the backend at Cloud SQL.

Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in `backend/.env`.

## Next steps
1. Add registration/login with password hashing and secure sessions or tokens. Never store plaintext passwords.
2. Add authorization checks so users can only modify their own sets and attempts.
3. Add migrations (for example, Alembic or a MySQL migration tool) instead of relying on manual schema edits.
4. For Cloud Run + Cloud SQL, use a Cloud SQL connector / attached Cloud SQL instance and Secret Manager. Avoid exposing the database publicly.
5. Add integration tests and a GitHub Actions CI workflow.

## Schema notes
- `password` is represented as `password_hash` in SQL: store a salted password hash, not the original password.
- `questionResponses` references a specific question within a flashcard set and the quiz attempt. The composite foreign key assumes each attempt's `set_id` matches the response's `set_id`.
- The `friends` constraint `user_id < friend_id` canonicalizes pairs, but the application must sort the IDs before inserting.
- MySQL foreign keys and unique constraints are included where the schema implies them.
