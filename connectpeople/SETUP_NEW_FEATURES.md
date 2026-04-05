# ConnectPeople - New Features Setup Guide

## 📋 Overview of New Features

This document covers the setup and usage of the following new features:

1. **Edit & Delete Posts** - Users can edit and delete their own posts
2. **24-Hour Stories** - Share temporary stories that expire after 24 hours
3. **Dark Mode** - Toggle between light and dark themes
4. **Settings Panel** - Centralized settings with font size options
5. **Font Size Options** - Customize text size (small, medium, large)
6. **Logout Button** - Available in the settings panel

---

## 🚀 Setup Instructions

### 1. Database Setup - Stories Table

First, set up the Stories table in your Supabase database.

**Steps:**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `STORIES_SCHEMA.sql`
4. Click **Run** to execute the schema

**What this creates:**
- `stories` table: Stores story images with 24-hour expiration
- `story_views` table: Tracks which users have viewed each story
- Row Level Security policies for public access

---

### 2. Configure Storage (if not already done)

If you haven't set up storage yet:

**Steps:**
1. Go to **Storage** in Supabase Dashboard
2. Create a bucket named `images` (if it doesn't exist)
3. Make it **Public**
4. Run `STORAGE_POLICIES.sql` in SQL Editor to add policies

---

## ✨ Features Explained

### Edit & Delete Posts

**How it works:**
- Only the post author can see the edit/delete menu
- Click the **three dots (⋯)** icon on your post
- Choose **Edit** to modify content/image
- Choose **Delete** to remove the post permanently

**Features:**
- Edit post content and image
- Delete removes all associated likes and comments
- Images are managed in cloud storage

### 24-Hour Stories

**How it works:**
- Stories appear at the top of the home feed
- Click **+** button to upload a new story
- Image must be selected
- Story automatically expires in 24 hours

**Features:**
- Automatically deletes after 24 hours
- Shows user profile picture overlay
- Click to view full story (view functionality can be added later)
- Only non-expired stories are visible

### Dark Mode

**How it works:**
1. Click the **Settings icon (⚙️)** in the top navbar
2. Select **Light Mode** or **Dark Mode**
3. Theme persists in browser (localStorage)

**Supported everywhere:**
- All pages and components
- Dark mode classes applied with Tailwind's `dark:` prefix
- Smooth transitions

### Settings Panel

**Access:**
- Click the **Settings icon (⚙️)** in the navbar

**Options:**
- **Theme**: Switch between Light and Dark modes
- **Font Size**: Choose Small, Medium, or Large text
- **Logout**: Sign out and return to login page

**Font Sizes:**
- **Small** (0.875rem) - Compact display
- **Medium** (1rem) - Default  
- **Large** (1.125rem) - More readable

---

## 🗄️ Database Schema

### Stories Table
```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
```

### Story Views Table
```sql
CREATE TABLE story_views (
  id UUID PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP,
  UNIQUE(story_id, user_id)
);
```

---

## 🎨 Styling & Dark Mode

### Dark Mode Implementation

Dark mode is implemented using Tailwind CSS `dark:` prefix:

```html
<!-- Light mode -->
<div className="bg-white text-gray-900">

<!-- Dark mode -->
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Theme Storage

Theme preference is persisted in `localStorage` using Zustand with the `persist` middleware:
- Key: `theme-storage`
- Includes: `theme` (light/dark) and `fontSize` (small/medium/large)

---

## 📁 New Files Created

```
src/
├── store/
│   └── themeStore.ts (Theme and font size management)
├── components/
│   ├── SettingsModal.tsx (Settings panel)
│   ├── DeletePostModal.tsx (Delete post confirmation)
│   ├── EditPostModal.tsx (Edit post form)
│   └── Stories.tsx (Stories component)
├── types/
│   └── story.ts (TypeScript interfaces for stories)
│
├── STORIES_SCHEMA.sql (Database schema for stories)
├── STORAGE_POLICIES.sql (Storage permissions)
├── STORAGE_SETUP.md (Storage setup guide)
└── tailwind.config.js (Tailwind configuration with dark mode)
```

---

## 🔐 Row Level Security (RLS)

### Stories Policies
- **Select**: Non-expired stories visible to everyone
- **Insert**: Only authenticated users can create
- **Delete**: Only the story owner can delete

### Storage Policies
- **Avatars**: Users can upload/delete their own
- **Stories**: Users can upload/delete their own  
- **Posts**: Users can upload/delete their own
- **Public Read**: Anyone can view images

---

## 🐛 Troubleshooting

### Stories not showing up?
1. Verify `STORIES_SCHEMA.sql` was executed
2. Check that images are uploading to storage
3. Verify `expires_at` is set to future time
4. Check browser console for errors

### Dark mode not persisting?
1. Check browser localStorage (`theme-storage`)
2. Ensure zustand is properly installed
3. Clear cache and reload

### Edit/Delete buttons not appearing?
1. Make sure you're viewing your own posts
2. Hover over three dots (⋯) on post
3. Check user ID matches post owner

### Font size not applying?
1. Settings are applied globally to `<html>` element
2. Refresh page to see full effect
3. Check that CSS is properly loaded

---

## 🎯 Future Enhancements

Potential features to add:
- View stories timeline (click to expand)
- Story reactions/replies
- Story sharing
- Story archive
- Multiple images per story
- Video story support
- Story analytics

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify database schema was created
3. Check browser console for error messages
4. Ensure all environment variables are set correctly

Enjoy your new features! 🎉
