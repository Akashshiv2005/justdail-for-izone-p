import os
import shutil

# Items to move to app/
items_to_move = [
    "routes",
    "models",
    "seo_engine",
    "verification_engine",
    "database.py",
    "main.py",
    "schemas.py",
    "auth_utils.py"
]

# Ensure app exists
os.makedirs("app", exist_ok=True)
with open("app/__init__.py", "w") as f:
    pass

# Move items
for item in items_to_move:
    if os.path.exists(item):
        shutil.move(item, os.path.join("app", item))

# We need to rewrite imports in ALL python files in backend (and backend/app)
modules_to_prefix = [
    "routes", "models", "seo_engine", "verification_engine",
    "database", "main", "schemas", "auth_utils"
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for mod in modules_to_prefix:
        # e.g., from models.business import -> from app.models.business import
        new_content = new_content.replace(f"from {mod}", f"from app.{mod}")
        new_content = new_content.replace(f"import {mod}", f"import app.{mod}")
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated imports in {filepath}")

for root, dirs, files in os.walk("."):
    if "venv" in root or "__pycache__" in root or ".git" in root:
        continue
    for file in files:
        if file.endswith(".py") and file != "refactor.py":
            process_file(os.path.join(root, file))

print("Refactoring complete.")
