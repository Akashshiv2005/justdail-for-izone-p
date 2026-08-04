# Project: iZone JustDial

## Project Structure
- **Frontend**: Vite + React + TypeScript (in `frontend/`)
- **Backend**: Python FastAPI (in `backend/`)
- **Database**: SQLite (`backend/bizdial.db`)

## Rules
- Always exclude `node_modules`, `venv`, `__pycache__`, `dist`, `.next` from file operations.
- When searching code, limit searches to `frontend/src/` and `backend/` directories.
- Do not read or modify files inside `node_modules/` or `venv/`.
- Keep file operations minimal and targeted to avoid overwhelming the file watcher.
