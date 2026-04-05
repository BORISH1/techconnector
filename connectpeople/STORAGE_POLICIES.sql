-- STORAGE POLICIES FOR CONNECTPEOPLE
-- Run this in your Supabase SQL Editor AFTER creating the 'images' bucket

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload images to avatars folder
CREATE POLICY "Users can upload avatar images" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- Allow authenticated users to update their own avatar images
CREATE POLICY "Users can update their own avatar images" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'avatars' AND
  (storage.filename(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar images
CREATE POLICY "Users can delete their own avatar images" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'avatars' AND
  (storage.filename(name))[1] = auth.uid()::text
);

-- Allow everyone to view images (for public access)
CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload post images
CREATE POLICY "Users can upload post images" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'posts'
);

-- Allow authenticated users to update their own post images
CREATE POLICY "Users can update their own post images" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'posts'
);

-- Allow authenticated users to delete their own post images
CREATE POLICY "Users can delete their own post images" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = 'posts'
);