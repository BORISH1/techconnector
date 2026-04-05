import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { Stories } from '../components/Stories';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { useAuthStore } from '../store/authStore';
import { Plus, Users, TrendingUp, Calendar } from 'lucide-react';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile } = useAuthStore();
  const isCreateModalOpen = searchParams.get('create') === 'true';

  const fetchPosts = async () => {
    try {
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch profiles for all posts
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');

      const profileMap = new Map((profilesData || []).map(p => [p.id, p]));

      // Fetch likes and comments counts for each post
      const postsWithStats = await Promise.all((postsData || []).map(async (post) => {
        // Get likes count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        // Get comments count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        // Check if current user has liked
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
          profiles: profileMap.get(post.user_id),
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user_has_liked: userHasLiked,
        };
      }));

      setPosts(postsWithStats);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 mb-6">
        {user && !profile && (
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
            <div className="font-semibold mb-2">Complete your profile</div>
            <p className="text-gray-700 mb-3">
              Finish your profile setup so your name, avatar, and details appear after login.
            </p>
            <Link
              to="/profile-setup"
              className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500 transition-colors"
            >
              Go to Profile Setup
            </Link>
          </div>
        )}
      </div>
      <div className="hidden lg:block lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-20 bg-blue-600"></div>
          <div className="px-4 pb-4 text-center">
            <img
              src={profile?.avatar_url || 'https://via.placeholder.com/64'}
              alt={profile?.name}
              className="w-16 h-16 rounded-xl border-4 border-white mx-auto -mt-8 object-cover shadow-sm mb-2"
              referrerPolicy="no-referrer"
            />
            <h3 className="font-bold text-gray-900">{profile?.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{profile?.job || 'ConnectPeople User'}</p>
            <div className="border-t border-gray-100 pt-4 flex justify-around text-sm">
              <div>
                <span className="block font-bold text-gray-900">0</span>
                <span className="text-gray-500">Posts</span>
              </div>
              <div>
                <span className="block font-bold text-gray-900">0</span>
                <span className="text-gray-500">Friends</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Trending Topics
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="text-blue-600 hover:underline cursor-pointer font-medium">#ConnectPeople</li>
            <li className="text-blue-600 hover:underline cursor-pointer font-medium">#ReactDevelopment</li>
            <li className="text-blue-600 hover:underline cursor-pointer font-medium">#SupabaseIsAwesome</li>
            <li className="text-blue-600 hover:underline cursor-pointer font-medium">#TechTrends2026</li>
          </ul>
        </div>
      </div>

      {/* Main Feed */}
      <div className="lg:col-span-6">
        {/* Stories */}
        <Stories />

        {/* Create Post Trigger */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 flex gap-4 items-center">
          <img
            src={profile?.avatar_url || 'https://via.placeholder.com/40'}
            alt={profile?.name}
            className="w-10 h-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={() => setSearchParams({ create: 'true' })}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 text-left px-4 py-2.5 rounded-full transition-colors font-medium"
          >
            What's on your mind, {profile?.name?.split(' ')[0]}?
          </button>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share something with the community!</p>
            <button
              onClick={() => setSearchParams({ create: 'true' })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create First Post
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar - Suggestions/Events
      <div className="hidden lg:block lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            People You May Know
          </h4>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-900">User {i}</p>
                    <p className="text-xs text-gray-500">Mutual Friend</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-bold text-xs">Follow</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Upcoming Events
          </h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-red-50 text-red-600 p-2 rounded-lg text-center min-w-[48px]">
                <span className="block text-xs font-bold uppercase">Apr</span>
                <span className="block text-lg font-bold">15</span>
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Tech Meetup 2026</p>
                <p className="text-xs text-gray-500">Virtual Event</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setSearchParams({})}
        onSuccess={fetchPosts}
      />
    </div>
  );
};
