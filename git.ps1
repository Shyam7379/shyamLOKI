param (
    [string]$m = "chore: update"
)

# Stage all tracked and untracked changes
git add .

# Only commit if there are staged changes
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes with message: '$m'..." -ForegroundColor Cyan
    git commit -m "$m"
} else {
    Write-Host "No changes to commit. Working tree is clean." -ForegroundColor Yellow
}

# Pull remote changes if any to prevent push rejection
git pull --rebase origin main

# Push to remote repository
Write-Host "Pushing to origin main..." -ForegroundColor Cyan
git push origin main