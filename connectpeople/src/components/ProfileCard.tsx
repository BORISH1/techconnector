import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, Heart, MapPin, Edit3 } from 'lucide-react';
import { Profile } from '../types';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

interface ProfileCardProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isOwnProfile }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <div className="px-6 pb-6">
        <div className="relative -mt-16 mb-4 flex justify-between items-end">
          <img
            src={profile.avatar_url || 'https://via.placeholder.com/128'}
            alt={profile.name}
            className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 object-cover shadow-md"
            referrerPolicy="no-referrer"
          />
          {isOwnProfile && (
            <Link
              to="/profile-setup"
              className="mb-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Link>
          )}
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{profile.job || 'Explorer'}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Briefcase className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span>{profile.job || 'No job specified'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span>Born {profile.dob ? formatDate(profile.dob) : 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Heart className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span>{profile.relationship_status || 'Single'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <span>Connected since {formatDate(profile.created_at)}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">About</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
            "{profile.bio || 'No bio yet. This person is a mystery!'}"
          </p>
        </div>
      </div>
    </div>
  );
};
