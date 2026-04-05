import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileCard } from '../components/ProfileCard';
import { PostCard } from '../components/PostCard';
import { supabase } from '../lib/supabase';
import { Profile, Post } from '../types';
import { useAuthStore } from '../store/authStore';
import { Grid, List, Bookmark, Loader2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('list');

  const fetchProfileAndPosts = async () => {
    if (!id) return;
    setLoading(true);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (*)
        `)
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch stats for each post
      const postsWithStats = await Promise.all((postsData || []).map(async (post) => {
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        let userHasLiked = false;
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('*')
            .match({ post_id: post.id, user_id: user.id })
            .maybeSingle();
          userHasLiked = !!likeData;
        }

        return {
          ...post,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_has_liked: userHasLiked,
        };
      }));

      setPosts(postsWithStats);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndPosts();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400">The user you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProfileCard profile={profile} isOwnProfile={user?.id === profile.id} />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex gap-8">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 pb-4 -mb-4 border-b-2 transition-colors font-bold text-sm uppercase tracking-wider ${
                view === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              Posts
            </button>
            <button
              className="flex items-center gap-2 pb-4 -mb-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors font-bold text-sm uppercase tracking-wider"
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </button>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {posts.length > 0 ? (
          view === 'list' ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onUpdate={fetchProfileAndPosts} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs text-gray-500 italic">
                      {post.content.substring(0, 50)}...
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                    <div className="flex items-center gap-1">
                      <Grid className="w-4 h-4 fill-current" />
                      {post.likes_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <List className="w-4 h-4" />
                      {post.comments_count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">No posts to show yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
