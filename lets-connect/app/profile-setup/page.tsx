"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/auth'; 
import { saveProfileDetails } from '@/app/actions/profile';

export default function ProfileSetup() {
  // 1. Grab the current logged-in user session
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    age: '',
    job: '',
    relationshipStatus: 'Single'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Safety check: ensure user is actually logged in
    if (!session?.user?.id) {
      setError("We couldn't verify your session. Please try logging in again.");
      return;
    }

    setLoading(true);

    // 2. Call our Server Action with the session ID
    const result = await saveProfileDetails(session.user.id, {
      age: parseInt(formData.age, 10), // Convert string to Int for Prisma
      job: formData.job,
      relationshipStatus: formData.relationshipStatus
    });

    if (result.success) {
      // 3. Success! Send them to the main app feed
      router.push('/feed');
    } else {
      setError(result.error || "Something went wrong.");
      setLoading(false);
    }
  };

  // Show a loading state while Better Auth checks the session
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-blue-600 font-bold tracking-widest uppercase text-sm">Loading Session...</div>
      </div>
    );
  }

  // If there is no session at all, they shouldn't be here
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <p className="text-slate-600">You must be logged in to view this page.</p>
        <button onClick={() => router.push('/signin')} className="text-blue-600 font-bold hover:underline">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-sm w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">One Last Step!</h1>
          <p className="text-slate-500 mt-2">Complete your profile to join the feed.</p>
        </div>

        {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Your Profession</label>
            <input 
              type="text" placeholder="e.g. Software Engineer, Student" required
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              onChange={(e) => setFormData({...formData, job: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Age</label>
              <input 
                type="number" placeholder="21" required min="13" max="120"
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Status</label>
              <select 
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all cursor-pointer"
                onChange={(e) => setFormData({...formData, relationshipStatus: e.target.value})}
                value={formData.relationshipStatus}
              >
                <option value="Single">Single</option>
                <option value="In a Relationship">In a Relationship</option>
                <option value="Married">Married</option>
              </select>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 mt-4 active:scale-95"
          >
            {loading ? "Saving to Database..." : "Finish & Explore"}
          </button>
        </form>
      </div>
    </div>
  );
}