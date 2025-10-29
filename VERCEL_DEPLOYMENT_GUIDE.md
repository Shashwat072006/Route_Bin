# Vercel Deployment Guide - Smart Waste Management System

## Fix for White Screen Issue

The white screen on Vercel is typically caused by missing environment variables or routing issues. Follow these steps:

---

## Step 1: Configure Environment Variables on Vercel

### Go to Your Vercel Project Settings:
1. Visit: https://vercel.com/dashboard
2. Select your `Route_Bin` project
3. Go to **Settings** → **Environment Variables**

### Add These Variables:
```
VITE_SUPABASE_URL = https://nfokxmgsafcgizxaaapr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mb2t4bWdzYWZjZ2l6eGFhYXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTM3NDYsImV4cCI6MjA3NjAyOTc0Nn0._20aHduiDfUuNYqI6a7XMxbHyv9KWKQYwJsMPvcvMpo
VITE_SUPABASE_PROJECT_ID = nfokxmgsafcgizxaaapr
```

**Important:** Add these for all environments (Production, Preview, Development)

---

## Step 2: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **three dots** (•••) on the latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache" (optional)
5. Click **Redeploy**

---

## Step 3: Verify Build Settings

In **Settings** → **General**, ensure:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node Version:** 18.x or higher

---

## Step 4: Check Build Logs

If still showing white screen:

1. Go to **Deployments**
2. Click on the latest deployment
3. Check the **Build Logs** for errors
4. Look for:
   - Missing dependencies
   - TypeScript errors
   - Environment variable warnings

---

## Common Issues & Solutions

### Issue 1: White Screen (No Errors)
**Cause:** Missing environment variables  
**Solution:** Add all VITE_* variables in Vercel settings

### Issue 2: 404 on Refresh
**Cause:** SPA routing not configured  
**Solution:** The `vercel.json` file is already configured to handle this

### Issue 3: Build Fails
**Cause:** Missing dependencies or TypeScript errors  
**Solution:** 
```bash
# Test build locally first
npm run build

# Check for errors
npm run lint
```

### Issue 4: Supabase Connection Error
**Cause:** Wrong Supabase credentials  
**Solution:** Verify your Supabase project URL and keys

---

## Alternative: Deploy from GitHub

### Option A: Connect GitHub Repository

1. Go to Vercel Dashboard
2. Click **Add New** → **Project**
3. Import from GitHub: `Shashwat072006/Route_Bin`
4. Configure:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

---

## Testing Locally Before Deploy

Always test the production build locally:

```bash
# Build the project
npm run build

# Preview the build
npm run preview

# Open http://localhost:4173
```

If it works locally but not on Vercel, it's an environment variable issue.

---

## Debugging Steps

### 1. Check Browser Console
- Open DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed requests

### 2. Check Vercel Function Logs
- Go to your deployment
- Click **Functions** tab
- Look for runtime errors

### 3. Enable Vercel Dev Mode
```bash
vercel dev
```
This simulates Vercel environment locally

---

## Environment Variables Checklist

Make sure these are set in Vercel:

- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✅ `VITE_SUPABASE_PROJECT_ID`

**Note:** All Vite env vars must start with `VITE_` prefix!

---

## Files Added to Fix Deployment

1. **`vercel.json`** - Routing configuration for SPA
2. **`.env.example`** - Template for environment variables
3. **Updated `src/integrations/supabase/client.ts`** - Added error handling

---

## Quick Fix Summary

1. ✅ Add environment variables in Vercel
2. ✅ Redeploy the project
3. ✅ Check browser console for errors
4. ✅ Verify Supabase credentials

Your app should now work on Vercel! 🚀

---

## Need Help?

If still facing issues:
1. Share the Vercel deployment URL
2. Share browser console errors
3. Share Vercel build logs

Repository: https://github.com/Shashwat072006/Route_Bin
