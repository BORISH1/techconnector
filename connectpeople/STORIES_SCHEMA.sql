-- SQL to add Stories table and policies to ConnectPeople
-- Run this in your Supabase SQL Editor

-- 5. Create Stories table
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 6. Create Story Views table
CREATE TABLE story_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(story_id, user_id)
);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;

-- Stories Policies
CREATE POLICY "Non-expired stories are viewable by everyone" ON stories FOR SELECT USING (
  expires_at > NOW()
);
CREATE POLICY "Authenticated users can create stories" ON stories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

-- Story Views Policies
CREATE POLICY "Story views are viewable by everyone" ON story_views FOR SELECT USING (true);
CREATE POLICY "Authenticated users can mark stories as viewed" ON story_views FOR INSERT WITH CHECK (auth.role() = 'authenticated');
