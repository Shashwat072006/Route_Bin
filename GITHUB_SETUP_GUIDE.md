# GitHub Setup Guide - Smart Waste Management System

## Quick Start: Push to GitHub

Your repository: **https://github.com/Shashwat072006/Route_Bin**

---

## Method 1: Using the Automated Script (Easiest)

### Step 1: Install Git
1. Download Git: https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/IDE

### Step 2: Update Email in Script
1. Open `PUSH_TO_GITHUB.bat` in a text editor
2. Find line: `git config user.email "your-email@example.com"`
3. Replace with your actual GitHub email
4. Save the file

### Step 3: Run the Script
1. Double-click `PUSH_TO_GITHUB.bat`
2. The script will automatically:
   - Initialize git repository
   - Add all files
   - Create initial commit
   - Push to GitHub

---

## Method 2: Manual Commands (After Installing Git)

Open PowerShell or Command Prompt in this folder and run:

```bash
# Initialize repository
git init

# Configure your details (replace with your info)
git config user.name "Shashwat072006"
git config user.email "your-email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Smart Waste Management System"

# Rename branch to main
git branch -M main

# Add remote repository
git remote add origin https://github.com/Shashwat072006/Route_Bin.git

# Push to GitHub
git push -u origin main --force
```

---

## Method 3: Using GitHub Desktop (No Command Line)

### Step 1: Install GitHub Desktop
1. Download: https://desktop.github.com/
2. Install and sign in with your GitHub account

### Step 2: Add Repository
1. Click **File** → **Add Local Repository**
2. Choose folder: `c:\Users\shash\Downloads\route-smart-bins-main\route-smart-bins-main`
3. Click **Create Repository** if prompted

### Step 3: Publish
1. Click **Publish repository**
2. Uncheck "Keep this code private" if you want it public
3. Repository name: `Route_Bin`
4. Click **Publish repository**

---

## Method 4: Using VS Code (If you have VS Code)

### Step 1: Install Git
Download and install Git from: https://git-scm.com/download/win

### Step 2: Open in VS Code
1. Open VS Code
2. File → Open Folder → Select this project folder

### Step 3: Initialize Repository
1. Click Source Control icon (left sidebar)
2. Click "Initialize Repository"
3. Stage all changes (click + next to "Changes")
4. Write commit message: "Initial commit: Smart Waste Management System"
5. Click ✓ to commit

### Step 4: Push to GitHub
1. Click "..." menu in Source Control
2. Select "Remote" → "Add Remote"
3. Enter: `https://github.com/Shashwat072006/Route_Bin.git`
4. Name it: `origin`
5. Click "..." → "Push" → "Push to..."
6. Select `origin/main`

---

## Authentication Issues?

If you get authentication errors when pushing:

### Option A: Use Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Generate and copy the token
5. When prompted for password, paste the token

### Option B: Use GitHub CLI
```bash
# Install GitHub CLI from: https://cli.github.com/
gh auth login
# Follow the prompts
```

---

## Verify Upload

After pushing, visit: https://github.com/Shashwat072006/Route_Bin

You should see all your files including:
- ✅ README.md with project documentation
- ✅ package.json with correct repository URL
- ✅ All source code in src/
- ✅ LICENSE file
- ✅ CONTRIBUTING.md
- ✅ Custom favicon.svg
- ✅ No Lovable references anywhere

---

## Project Details

- **Name**: Smart Waste Management System
- **Author**: Smart Waste Management Team
- **Repository**: https://github.com/Shashwat072006/Route_Bin
- **Version**: 1.0.0
- **License**: MIT

---

## Need Help?

If you encounter any issues:
1. Make sure Git is installed: `git --version`
2. Check you're in the correct folder
3. Ensure you have write access to the repository
4. Try using GitHub Desktop for a GUI approach

---

**Status**: ✅ Project is clean and ready to push!
