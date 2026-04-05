import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface Story {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
  expires_at: string;
  profiles?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

interface StoryUser {
  user_id: string;
  profile: {
    id: string;
    name: string;
    avatar_url: string;
  };
  unviewed: boolean;
  story?: Story;
}

export const Stories: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [stories, setStories] = useState<StoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      // Get all non-expired stories
      const now = new Date().toISOString();
      const { data: storiesData, error } = await supabase
        .from('stories')
        .select(`
          id,
          user_id,
          image_url,
          created_at,
          expires_at,
          profiles:user_id (id, name, avatar_url)
        `)
        .gt('expires_at', now)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group stories by user
      const groupedStories = new Map<string, StoryUser>();
      storiesData?.forEach((story) => {
        const profileData = Array.isArray(story.profiles) ? story.profiles[0] : story.profiles;
        if (!groupedStories.has(story.user_id)) {
          groupedStories.set(story.user_id, {
            user_id: story.user_id,
            profile: profileData,
            unviewed: true,
            story: story as any,
          });
        }
      });

      setStories(Array.from(groupedStories.values()));
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return;
    }

    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    setUploading(true);
    try {
      // Upload image
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `stories/${fileName}`;

      console.log('Uploading story to:', filePath);

      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Create story record (expires in 24 hours)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      console.log('Creating story record...');

      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Failed to save story: ${insertError.message}`);
      }

      console.log('Story created successfully');
      setShowUpload(false);
      await fetchStories();
      alert('Story uploaded successfully! It will expire in 24 hours.');
    } catch (error) {
      console.error('Error uploading story:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to upload story: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex overflow-x-auto gap-3 pb-2">
        {/* Add story button */}
        <button
          onClick={() => setShowUpload(true)}
          className="flex-shrink-0 w-20 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative"
        >
          <Plus className="w-6 h-6" />
          {showUpload && (
            <div className="absolute inset-0 rounded-xl bg-white dark:bg-gray-900 flex flex-col items-center justify-center gap-2">
              <label className="cursor-pointer flex flex-col items-center gap-1">
                <Upload className="w-4 h-4" />
                <span className="text-xs">Story</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadStory}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          )}
        </button>

        {/* Stories */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : stories.length > 0 ? (
          stories.map((storyUser) => (
            <div key={storyUser.user_id} className="flex-shrink-0">
              <div className="relative">
                <img
                  src={storyUser.story?.image_url || 'https://via.placeholder.com/80'}
                  alt={storyUser.profile.name}
                  className="w-20 h-24 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
                <img
                  src={storyUser.profile.avatar_url || 'https://via.placeholder.com/32'}
                  alt={storyUser.profile.name}
                  className={`w-6 h-6 rounded-full object-cover border-2 absolute bottom-1 left-1 ${
                    storyUser.unviewed ? 'border-blue-600' : 'border-gray-400'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1 text-center">
                {storyUser.profile.name.split(' ')[0]}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
            No stories yet
          </div>
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Share Your Story
              </h2>
              <button
                onClick={() => setShowUpload(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {uploading ? 'Uploading...' : 'Click to upload story'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Expires in 24 hours
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadStory}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
