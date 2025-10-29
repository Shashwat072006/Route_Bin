@echo off
echo ========================================
echo Smart Waste Management System
echo GitHub Push Script
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo After installation, restart your terminal and run this script again.
    pause
    exit /b 1
)

echo Git found! Proceeding with repository setup...
echo.

REM Initialize git repository
echo [1/6] Initializing git repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)

REM Configure git user (update these with your details)
echo [2/6] Configuring git user...
git config user.name "Shashwat072006"
git config user.email "your-email@example.com"

REM Add all files
echo [3/6] Adding all files to git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

REM Create initial commit
echo [4/6] Creating initial commit...
git commit -m "Initial commit: Smart Waste Management System - Clean version without Lovable references"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

REM Rename branch to main
echo [5/6] Renaming branch to main...
git branch -M main

REM Add remote origin
echo [6/6] Adding remote origin and pushing...
git remote add origin https://github.com/Shashwat072006/Route_Bin.git

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main --force
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to push to GitHub
    echo.
    echo This might be because:
    echo 1. You need to authenticate with GitHub
    echo 2. The repository already has content
    echo 3. You don't have write permissions
    echo.
    echo Try running: git push -u origin main --force
    echo Or authenticate using GitHub CLI or Personal Access Token
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Project pushed to GitHub
echo Repository: https://github.com/Shashwat072006/Route_Bin
echo ========================================
echo.
pause
