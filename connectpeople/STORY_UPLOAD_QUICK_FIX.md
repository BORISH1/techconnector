# 🚀 QUICK FIX: Story Upload Not Working

## 3 Simple Steps to Fix

---

## ✅ STEP 1: Create Storage Bucket (5 minutes)

1. Open Supabase Dashboard
2. Click **Storage** in left sidebar
3. Look for bucket named `images`
   
   **If you DON'T see it:**
   - Click **Create bucket** button
   - Name: `images`
   - ✓ **CHECK** "Public bucket"
   - Click **Create bucket**

   **If you DO see it:**
   - Click it
   - Click **Settings**
   - Make sure **Public bucket** is checked ✓

---

## ✅ STEP 2: Add Permissions (5 minutes)

1. In Supabase, click **SQL Editor**
2. Click **New Query**
3. Copy ALL the code from: `QUICK_FIX_STORY_UPLOAD.sql`
4. Paste into SQL Editor
5. Click **RUN** button
6. Wait for green success message ✅

---

## ✅ STEP 3: Create Stories Table (5 minutes)

1. In Supabase, click **SQL Editor**
2. Click **New Query**
3. Copy ALL the code from: `STORIES_SCHEMA.sql`
4. Paste into SQL Editor
5. Click **RUN** button
6. Wait for green success message ✅

---

## 🎉 Now Try Uploading

1. Go to your app home page
2. Find Stories section (top of feed)
3. Click **+ button**
4. Select an image (JPG or PNG)
5. Wait for "Story uploaded successfully!" message

---

## 🆘 Still Not Working?

**Check these:**

- [ ] Is storage bucket `images` set to **Public**? (Most common issue!)
- [ ] Did the SQL queries run **without errors**?
- [ ] Is your image **under 5MB**?
- [ ] Are you **logged in** to the app?
- [ ] Check **browser console** (F12 key) for error messages

---

## 📋 Files You Need

| File | What to do |
|------|-----------|
| `QUICK_FIX_STORY_UPLOAD.sql` | Copy & run this SQL first |
| `STORIES_SCHEMA.sql` | Copy & run this SQL second |
| `STORY_UPLOAD_TROUBLESHOOTING.md` | Read if still having issues |

---

## 💡 Quick Troubleshooting

**Error: "bucket not found"**
→ Create `images` bucket in Storage (Step 1)

**Error: "violates row-level security policy"**  
→ Run `QUICK_FIX_STORY_UPLOAD.sql` (Step 2)

**Error: "relation 'stories' does not exist"**
→ Run `STORIES_SCHEMA.sql` (Step 3)

**Error: "HTTP 413"**
→ Your image is too large (use under 5MB)

**Error: "invalid image type"**
→ Use JPG or PNG format only

---

**The most common issue is Step 1 - make sure bucket is PUBLIC! 🎯**

Try these 3 steps and it will work! 🚀
