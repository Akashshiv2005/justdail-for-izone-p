Get-ChildItem -Path "d:\izone justdial\frontend\src\components\dashboard\owner\tabs" -Filter "*.tsx" | ForEach-Object {
     = Get-Content .FullName
    if ( -match "mock" -or  -notmatch "authFetch") {
        Write-Host "Owner Tab:  might not be fully integrated"
    }
}
Get-ChildItem -Path "d:\izone justdial\frontend\src\pages\super-admin" -Filter "*.tsx" | ForEach-Object {
     = Get-Content .FullName
    if ( -match "mock" -or  -notmatch "authFetch") {
        Write-Host "Admin Tab:  might not be fully integrated"
    }
}
