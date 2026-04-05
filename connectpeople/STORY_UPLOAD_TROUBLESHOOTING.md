# 🆘 Story Upload Troubleshooting Guide

If you're getting "Failed to upload story" error, follow these steps to fix it:

---

## ✅ Step 1: Verify Storage Bucket Exists

1. **Go to Supabase Dashboard** → **Storage**
2. Look for a bucket named `images`

### If `images` bucket DOES NOT exist:
1. Click **Create bucket**
2. Name: `images`
3. ✓ Check **Public bucket** (IMPORTANT!)
4. Click **Create bucket**

### If `images` bucket DOES exist:
- Click on it
- Click **Settings** (top right)
- Verify **Public bucket** is enabled
- If not, enable it

---

## ✅ Step 2: Add Storage Policies

Even if the bucket exists, it may not have the right permissions.

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Click "New Query"**
3. Copy and paste the entire content below:

```sql
-- STORAGE POLICIES FOR CONNECTPEOPLE
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload images to stories folder
CREATE POLICY "Users can upload story images" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'stories'
);

-- Allow authenticated users to upload images to avatars folder
CREATE POLICY "Users can upload avatar images" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Allow authenticated users to upload images to posts folder
CREATE POLICY "Users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'posts'
);

-- Allow everyone to view images (for public access)
CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow users to update their own uploads
CREATE POLICY "Users can update their uploads" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images'
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their uploads" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images'
);
```

4. Click **Run**
5. Wait for success message

---

## ✅ Step 3: Create Stories Table

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Click "New Query"**
3. Copy and paste the entire content of `STORIES_SCHEMA.sql`
4. Click **Run**

---

## ✅ Step 4: Check Browser Console for Errors

1. **Open your browser**
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Try uploading a story again
5. Look for error messages in console

**Common errors and what they mean:**

| Error | Cause | Solution |
|-------|-------|----------|
| "bucket not found" | Storage bucket doesn't exist | Create `images` bucket (Step 1) |
| "new row violates row-level security policy" | RLS policies not set | Run SQL policies (Step 2) |
| "relation 'stories' does not exist" | Stories table not created | Run STORIES_SCHEMA.sql (Step 3) |
| "HTTP 413" | File too large | Use image under 5MB |
| "invalid image type" | Wrong file format | Use JPG, PNG, GIF, or WebP |

---

## ✅ Step 5: Verify You're Logged In

- Make sure you're logged in to the app
- Your profile should show in the top navbar
- If not, go to Login page and sign in

---

## ✅ Step 6: Test Upload

1. Click **Home** in navbar
2. Find the **Stories** section at top of feed
3. Click the **+ icon**
4. Select a JPG or PNG image under 5MB
5. Wait for upload to complete

**Expected:**
- Success message: "Story uploaded successfully! It will expire in 24 hours."
- Your story appears in the stories bar

---

## 🔍 Detailed Troubleshooting

### Issue: "Failed to upload story"

**Check #1: Is the storage bucket public?**
```
Supabase → Storage → images → Settings → "Public bucket" toggle should be ON
```

**Check #2: Is the file valid?**
- File size under 5MB?
- Image format (JPG, PNG, GIF, WebP)?
- File not corrupted?

**Check #3: Are you authenticated?**
- Logged in to app?
- Session not expired?
- Check browser console for auth errors

**Check #4: SQL policies applied?**
```
Supabase → SQL Editor → Check recent queries
Did STORAGE_POLICIES.sql run successfully?
```

### Issue: "relation 'stories' does not exist"

**Solution:**
1. Go to Supabase → SQL Editor
2. Run `STORIES_SCHEMA.sql` 
3. Make sure it completed without errors

---

## 🛠️ Quick Fix Checklist

- [ ] Storage bucket `images` exists
- [ ] Storage bucket is set to **Public**
- [ ] Storage policies SQL has been executed
- [ ] Stories table created (STORIES_SCHEMA.sql)
- [ ] User is logged in
- [ ] Image file is valid (JPG/PNG, under 5MB)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful uploads

---

## 📞 Still Having Issues?

If you've completed all steps above and still get errors:

1. **Check Supabase Status**: https://status.supabase.com
2. **Check Network Tab** (F12 → Network → Upload request)
3. **Try a different image** (different size/format)
4. **Refresh page** and try again
5. **Clear browser cache** (Ctrl+Shift+Delete)
6. **Log out and log back in**

---

## 💡 Pro Tips

- Use smaller images (1-2 MB) for faster uploads
- JPG format often smaller than PNG
- Test with a simple image first (color, minimal content)
- Stories auto-expire in 24 hours, no need to delete
- One story per user visible at a time

---

**Your stories should now upload successfully! 🎉**
