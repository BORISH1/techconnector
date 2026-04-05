import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Home, User, PlusSquare, Users, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { SettingsModal } from './SettingsModal';

export const Navbar: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);
  const [, setSearchParams] = useSearchParams();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">ConnectPeople</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
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

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </nav>
  );
};
