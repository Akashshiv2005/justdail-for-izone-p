import os
import glob
import re

frontend_dir = r"c:\Users\IZONE 181\OneDrive\Documents\new biz\justdail-for-izone-p\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find if there's any fetch('/api/ or fetch(`/api/
    # We will just look for fetch( and see if it's pointing to /api
    if "fetch('/api/" not in content and 'fetch(`/api/' not in content and 'fetch("/api/' not in content:
        return

    # Replace fetch( with apiClient(
    new_content = re.sub(r'fetch\(([\'"`]/api/)', r'apiClient(\1', content)

    # Determine relative path to lib/api.ts
    # If the file is in src/pages/, depth is 1. If in src/components/dashboard/owner/tabs, depth is 4.
    rel_path = os.path.relpath(filepath, frontend_dir)
    depth = rel_path.count(os.sep)
    
    if depth == 0:
        import_path = "./lib/api"
    else:
        import_path = "../" * depth + "lib/api"
        
    import_stmt = f"import {{ apiClient }} from '{import_path}';\n"
    
    # Check if already imported
    if "import { apiClient }" not in new_content:
        # Add import after the last import statement
        lines = new_content.split('\n')
        last_import = 0
        for i, line in enumerate(lines):
            if line.startswith("import "):
                last_import = i
        lines.insert(last_import + 1, import_stmt)
        new_content = '\n'.join(lines)

    with open(filepath, 'w', encoding='utf-8', errors='ignore') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            if file == 'api.ts':
                continue
            process_file(os.path.join(root, file))

print("Done")
