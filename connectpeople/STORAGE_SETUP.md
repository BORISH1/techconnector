# ConnectPeople - Storage Setup Instructions

## Setting up Supabase Storage

To fix the profile editing issues, you need to set up the storage bucket and policies in Supabase.

### Step 1: Create the Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the sidebar
3. Click **Create bucket**
4. Name it: `images`
5. Make it **Public** (check the "Public bucket" option)
6. Click **Create bucket**

### Step 2: Add Storage Policies

1. In your Supabase Dashboard, go to **SQL Editor**
2. Copy and paste the contents of `STORAGE_POLICIES.sql` from this project
3. Click **Run** to execute the policies

### Step 3: Verify Setup

After running the policies, try editing a profile again. The avatar upload and profile save should now work.

## What the Policies Do

- **Avatar Upload**: Allows authenticated users to upload images to the `avatars/` folder
- **Post Images**: Allows authenticated users to upload images to the `posts/` folder
- **Public Access**: Allows anyone to view images (necessary for displaying avatars and post images)
- **User Ownership**: Users can only update/delete their own uploaded images

## Troubleshooting

If you still get errors:

1. **Check bucket exists**: Make sure the `images` bucket exists and is public
2. **Check policies**: Run the storage policies SQL again
3. **Check user authentication**: Make sure you're logged in when trying to upload
4. **Check file types**: Only image files are allowed (jpg, png, gif, etc.)

The profile editing should work after following these steps!