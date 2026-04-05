# 🎯 Story Upload - Issue Reference Guide

## All Upload Issues & Solutions

---

### ❌ Issue #1: "bucket not found"

**What it means:**
- Storage bucket `images` doesn't exist

**How to fix:**
1. Go to Supabase → **Storage**
2. Click **Create bucket**
3. Name it: `images`
4. ✓ Check **"Public bucket"**
5. Click **Create bucket**

---

### ❌ Issue #2: "new row violates row-level security policy"

**What it means:**
- You don't have permission to upload

**How to fix:**
1. Go to Supabase → **SQL Editor**
2. Click **New Query**
3. Paste: `QUICK_FIX_STORY_UPLOAD.sql`
4. Click **RUN**
5. Wait for green success

---

### ❌ Issue #3: "relation 'stories' does not exist"

**What it means:**
- Stories table not created in database

**How to fix:**
1. Go to Supabase → **SQL Editor**
2. Click **New Query**
3. Paste entire: `STORIES_SCHEMA.sql`
4. Click **RUN**
5. Wait for green success

---

### ❌ Issue #4: "HTTP 413 Payload Too Large"

**What it means:**
- Your image file is too big

**How to fix:**
- Use a smaller image file
- Maximum: 5MB
- Try compressing the image first

---

### ❌ Issue #5: "Invalid image type"

**What it means:**
- File format not supported

**How to fix:**
- Use only: **JPG, PNG, GIF, or WebP**
- Don't use: BMP, TIFF, WEBP variants
- Check file extension

---

### ❌ Issue #6: "bucket is not public"

**What it means:**
- Storage bucket exists but can't be accessed

**How to fix:**
1. Go to Supabase → **Storage**
2. Click `images` bucket
3. Click **Settings** (top right)
4. Toggle **"Public bucket"** ON ✓
5. Refresh the app and try again

---

### ❌ Issue #7: Upload says "loading" forever

**What it means:**
- Upload is stuck/hanging
- Network issue or permission issue

**How to fix:**
1. Wait 1 minute
2. If still loading: refresh page (Ctrl+R)
3. Try different image
4. Check internet connection
5. Try again

---

### ❌ Issue #8: "Network Error" or no response

**What it means:**
- Can't connect to Supabase
- Internet connection issue

**How to fix:**
1. Check internet connection
2. Refresh page
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart browser
5. Try again

---

## Quick Diagnosis: What Error Do You See?

**At browser console (F12 → Console tab):**

```javascript
// You'll see one of these:

// Error 1:
"bucket not found" 
→ Create 'images' bucket

// Error 2:
"violates row-level security"
→ Run QUICK_FIX_STORY_UPLOAD.sql

// Error 3:
"relation 'stories' does not exist"
→ Run STORIES_SCHEMA.sql

// Error 4:
"upload error: [something]"
→ Screenshot this and check details
```

---

## The Golden Rule

### ⭐ **Storage bucket MUST be PUBLIC!**

If your uploads are failing, **99% of the time** it's because the storage bucket is not set to **Public**.

**How to verify:**
1. Supabase Dashboard
2. **Storage**
3. Click `images` bucket
4. Click **Settings**
5. Look for toggle: **"Public bucket"**
6. Should be **turned ON** ✓ (blue)

If it's OFF (grey), click it to turn it ON!

---

## Step-by-Step Fix Priority

**Try these in order:**

1. ✅ Verify storage bucket is **Public**
2. ✅ Run `QUICK_FIX_STORY_UPLOAD.sql`
3. ✅ Run `STORIES_SCHEMA.sql`
4. ✅ Refresh page (Ctrl+R)
5. ✅ Log out and log back in
6. ✅ Try with different image

---

## File Checklist

You have these files to help:

- ✓ `QUICK_FIX_STORY_UPLOAD.sql` - Quick SQL fix (Step 2)
- ✓ `STORIES_SCHEMA.sql` - Create tables (Step 3)
- ✓ `STORY_UPLOAD_FINAL_SOLUTION.md` - Complete guide
- ✓ `STORY_UPLOAD_QUICK_FIX.md` - Super simple version
- ✓ `STORY_UPLOAD_TROUBLESHOOTING.md` - Detailed help

---

## Success Indicators

**You'll know it worked when:**

1. ✅ No error messages appear
2. ✅ Image preview shows in the modal
3. ✅ "Story uploaded successfully!" message appears
4. ✅ Your image appears in stories bar at top
5. ✅ Story timer shows "24 hours" remaining

---

## Emergency Contacts Info

If all else fails:

1. Check Supabase status: https://status.supabase.com
2. Check browser developer console (F12)
3. Clear all browser data
4. Try a completely different browser
5. Take screenshot of error and share

---

**Follow the priority order above and your upload will work!** 🚀
