import os

# Fix authFetch imports
for file in [
    r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminDashboardTab.tsx",
    r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminDynamicDataTab.tsx"
]:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('../../../../lib/services/authFetch', '../../../lib/services/authFetch')
    # Fix implicit any by replacing .then(res => with .then((res: any) => etc
    content = content.replace('.then(res =>', '.then((res: any) =>')
    content = content.replace('.then(data =>', '.then((data: any) =>')
    content = content.replace('.catch(err =>', '.catch((err: any) =>')
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix export defaults
files_to_export = [
    (r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminDynamicDataTab.tsx", "function AdminDynamicDataTab"),
    (r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminAnalyticsTab.tsx", "function AdminAnalyticsTab"),
    (r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminSettingsTab.tsx", "function AdminSettingsTab")
]

for file, func_str in files_to_export:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(func_str, 'export default ' + func_str)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix missing Users import in AdminDynamicDataTab.tsx
dyn_file = r"d:\izone justdial\frontend\src\components\dashboard\admin\AdminDynamicDataTab.tsx"
with open(dyn_file, 'r', encoding='utf-8') as f:
    dyn_content = f.read()
dyn_content = dyn_content.replace('UserSquare2, Target', 'UserSquare2, Target, Users')
with open(dyn_file, 'w', encoding='utf-8') as f:
    f.write(dyn_content)

print("Patch complete")
