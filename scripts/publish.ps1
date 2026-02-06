param(
  [Parameter(Mandatory=$true)][string]$RepoUrl,
  [string]$Pat = ""
)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
git --version | Out-Null
if (!(Test-Path ".git")) {
  git init
  try { git checkout -b main } catch { git branch -M main }
}
git add -A
try { git commit -m "chore: initial commit (PWA + Pages workflow)" } catch { }
if (!(git remote | Select-String -SimpleMatch "origin")) {
  git remote add origin $RepoUrl
} else {
  git remote set-url origin $RepoUrl
}
if ($Pat -ne "") {
  if ($RepoUrl -match '^https://github\.com/([^/]+)/(.+)$') {
    $owner = $Matches[1]
    $url = $RepoUrl -replace '^https://github\.com/', "https://${owner}:${Pat}@github.com/"
    git remote set-url origin $url
    git push -u origin main
    git remote set-url origin $RepoUrl
  } else {
    git push -u origin main
  }
} else {
  git push -u origin main
}
