import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Home, User, PlusSquare, Users, Settings, Bell, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDetails, setNotificationDetails] = useState<{ likes: number; comments: number } | null>(null);
  const [, setSearchParams] = useSearchParams();

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', user.id);

      if (postsError) throw postsError;

      const postIds = (postsData || []).map((post) => post.id);
      if (postIds.length === 0) {
        setNotificationCount(0);
        setNotificationDetails({ likes: 0, comments: 0 });
        return;
      }

      const [{ count: likesCount }, { count: commentsCount }] = await Promise.all([
        supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .in('post_id', postIds)
          .neq('user_id', user.id),
        supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .in('post_id', postIds)
          .neq('user_id', user.id),
      ]);

      const likes = likesCount || 0;
      const comments = commentsCount || 0;
      setNotificationCount(likes + comments);
      setNotificationDetails({ likes, comments });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications, user]);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">ConnectPeople</span>
        </Link>

        <div className="relative flex items-center gap-1 sm:gap-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Notifications"
          >
            <Bell className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] text-white font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Likes</p>
                  <p>{notificationDetails?.likes ?? 0} new likes on your posts</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Comments</p>
                  <p>{notificationDetails?.comments ?? 0} new comments on your posts</p>
                </div>
                {!notificationCount && (
                  <p className="text-gray-500 dark:text-gray-400">No new interactions yet.</p>
                )}
              </div>
            </div>
          )}

          <Link
            to="/home"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Home"
          >
            <Home className="w-6 h-6" />
          </Link>
          
          <button
            onClick={() => setSearchParams({ create: 'true' })}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Create Post"
          >
            <PlusSquare className="w-6 h-6" />
          </button>

          {profile ? (
            <Link
              to={`/profile/${profile.id}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
              title="Profile"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-6 h-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-6 h-6" />
              )}
              <span className="text-sm font-medium hidden md:inline text-gray-900 dark:text-white">{profile.name}</span>
            </Link>
          ) : (
            <Link
              to="/profile-setup"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
              title="Complete Profile"
            >
              <User className="w-6 h-6" />
              <span className="text-sm font-medium hidden md:inline text-gray-900 dark:text-white">{user?.user_metadata?.full_name || 'Complete Profile'}</span>
            </Link>
          )}

          <Link
            to="/settings"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
};
