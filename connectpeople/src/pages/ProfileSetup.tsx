import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Loader2, Save, User, Calendar, Briefcase, Heart, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export const ProfileSetup: React.FC = () => {
  const { user, profile, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Profile setup unavailable</h1>
          <p className="text-gray-600 mb-6">
            Please log in first to complete your profile.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [relationship, setRelationship] = useState('Single');
  const [job, setJob] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDob(profile.dob || '');
      setRelationship(profile.relationship_status || 'Single');
      setJob(profile.job || '');
      setBio(profile.bio || '');
      setAvatarPreview(profile.avatar_url || null);
    } else if (user?.user_metadata?.full_name) {
      setName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let avatarUrl = avatarPreview || '';

      if (avatar) {
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (avatar.size > maxSize) {
          alert('Avatar size must be less than 5MB');
          setLoading(false);
          return;
        }

        if (!validTypes.includes(avatar.type)) {
          alert('Only JPG, PNG, GIF, and WebP images are allowed');
          setLoading(false);
          return;
        }

        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        console.log('Uploading avatar to:', filePath);

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, avatar, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Avatar upload failed: ${uploadError.message}`);
        }

        console.log('Avatar uploaded successfully');

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      // First try to update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name,
          email: user.email,
          dob,
          relationship_status: relationship,
          job,
          bio,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      // If update failed (profile doesn't exist), create new profile
      if (updateError) {
        console.log('Profile update failed, trying to create new profile:', updateError);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name,
            email: user.email,
            dob,
            relationship_status: relationship,
            job,
            bio,
            avatar_url: avatarUrl,
          });

        if (insertError) {
          console.error('Profile insert error:', insertError);
          throw new Error(`Failed to save profile: ${insertError.message}`);
        }
      }

      await fetchProfile(user.id);
      navigate('/home');
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save profile: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-8 flex justify-center">
              <div className="relative">
                <img
                  src={avatarPreview || 'https://via.placeholder.com/128'}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-2xl border-4 border-white object-cover shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
              <p className="text-gray-500">Tell the community a bit about yourself</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" /> Job / Profession
                  </label>
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-400" /> Relationship Status
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option>Single</option>
                    <option>Married</option>
                    <option>In a relationship</option>
                    <option>It's complicated</option>
                    <option>Engaged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full min-h-[120px] px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
