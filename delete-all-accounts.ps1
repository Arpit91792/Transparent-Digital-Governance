# PowerShell script to delete all accounts and details
# Run with: .\delete-all-accounts.ps1

$SERVER_URL = if ($env:SERVER_URL) { $env:SERVER_URL } else { "http://localhost:5000" }
$ADMIN_EMAIL = if ($env:ADMIN_EMAIL) { $env:ADMIN_EMAIL } else { "admin@example.com" }
$ADMIN_PASSWORD = if ($env:ADMIN_PASSWORD) { $env:ADMIN_PASSWORD } else { "password123" }

Write-Host "🔐 Logging in as admin..." -ForegroundColor Cyan
Write-Host "   Email: $ADMIN_EMAIL"

# Step 1: Login as admin
$loginBody = @{
    email = $ADMIN_EMAIL
    password = $ADMIN_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$SERVER_URL/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if (-not $loginResponse.token) {
        Write-Host "❌ Login failed: $($loginResponse | ConvertTo-Json)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please make sure:" -ForegroundColor Yellow
        Write-Host "1. The server is running (npm run dev)" -ForegroundColor Yellow
        Write-Host "2. Admin credentials are correct" -ForegroundColor Yellow
        exit 1
    }

    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host ""

    # Step 2: Delete all accounts and details
    Write-Host "⚠️  Deleting all accounts and all associated details..." -ForegroundColor Yellow
    Write-Host "   This action cannot be undone!" -ForegroundColor Yellow
    Write-Host ""

    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    try {
        $deleteResponse = Invoke-RestMethod -Uri "$SERVER_URL/api/admin/delete-all-accounts-and-details" -Method POST -Headers $headers

        Write-Host "✅ Successfully deleted all accounts and details!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Deletion Summary:" -ForegroundColor Cyan
        Write-Host "   - $($deleteResponse.usersDeleted) user account(s)"
        Write-Host "   - $($deleteResponse.applicationsDeleted) application(s)"
        Write-Host "   - $($deleteResponse.feedbackDeleted) feedback/rating(s)"
        Write-Host "   - $($deleteResponse.notificationsDeleted) notification(s)"
        Write-Host "   - $($deleteResponse.warningsDeleted) warning(s)"
        Write-Host "   - $($deleteResponse.otpRecordsDeleted) OTP record(s)"
        Write-Host "   - $($deleteResponse.blockchainHashesDeleted) blockchain hash(es)"
        Write-Host "   - $($deleteResponse.applicationHistoryDeleted) application history record(s)"
        Write-Host "   - $($deleteResponse.applicationLocationHistoryDeleted) location history record(s)"
        Write-Host ""
        Write-Host "ℹ️  Note: Restart your server to recreate the default admin account." -ForegroundColor Yellow
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 404) {
            Write-Host "❌ Endpoint not found. The server needs to be restarted to load the new route." -ForegroundColor Red
            Write-Host "   Please restart your server: npm run dev" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Alternatively, using the clear-all-data endpoint (deletes everything including departments):" -ForegroundColor Yellow
            try {
                $clearResponse = Invoke-RestMethod -Uri "$SERVER_URL/api/admin/clear-all-data" -Method POST
                Write-Host "✅ All data cleared successfully!" -ForegroundColor Green
            }
            catch {
                Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        elseif ($statusCode -eq 401 -or $statusCode -eq 403) {
            Write-Host "❌ Authentication failed. You need to be logged in as admin." -ForegroundColor Red
        }
        else {
            Write-Host "❌ Error deleting accounts: $($_.Exception.Message)" -ForegroundColor Red
        }
        exit 1
    }
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "1. The server is running: npm run dev" -ForegroundColor Yellow
    Write-Host "2. The server URL is correct" -ForegroundColor Yellow
    exit 1
}
