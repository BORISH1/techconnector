-- COMPLETE STORAGE POLICIES FIX FOR STORY UPLOADS
-- Copy and paste this entire script into Supabase SQL Editor and click RUN

-- Step 1: Enable RLS on storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing story policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload story images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their uploads" ON storage.objects;

-- Step 3: Create new policies for story uploads
CREATE POLICY "Users can upload story images" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'images'
);

CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Users can update their uploads" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images'
);

CREATE POLICY "Users can delete their uploads" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images'
);
