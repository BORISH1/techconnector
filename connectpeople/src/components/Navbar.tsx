import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, PlusSquare, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">ConnectPeople</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <Link
            to="/home"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600"
            title="Home"
          >
            <Home className="w-6 h-6" />
          </Link>
          
          <button
            onClick={() => navigate('/home?create=true')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600"
            title="Create Post"
          >
            <PlusSquare className="w-6 h-6" />
          </button>

          {profile ? (
            <Link
              to={`/profile/${profile.id}`}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600 flex items-center gap-2"
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
              <span className="text-sm font-medium hidden md:inline">{profile.name}</span>
            </Link>
          ) : (
            <Link
              to="/profile-setup"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600 flex items-center gap-2"
              title="Complete Profile"
            >
              <User className="w-6 h-6" />
              <span className="text-sm font-medium hidden md:inline">{user?.user_metadata?.full_name || 'Complete Profile'}</span>
            </Link>
          )}

          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-600 hover:text-red-600"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};
