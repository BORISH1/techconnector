// app/profile-setup/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/auth'; 
import { saveProfileDetails } from '../actions/profile';

export default function ProfileSetup() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ age: '', job: '', relationshipStatus: 'Single' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!session?.user?.id) {
      setError("Session missing. Please log in again.");
      return;
    }

    setLoading(true);
    const result = await saveProfileDetails(session.user.id, {
      age: parseInt(formData.age, 10),
      job: formData.job,
      relationshipStatus: formData.relationshipStatus
    });

    if (result.success) {
      window.location.href = '/feed'; // Full redirect to clear any state issues
    } else {
      setError(result.error || "Database save failed.");
      setLoading(false);
    }
  };

  if (isPending) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600 animate-pulse">Loading Session...</div>;
  if (!session) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-sm w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">One Last Step!</h1>
          <p className="text-slate-500 mt-2">Complete your profile.</p>
        </div>
        {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <input type="text" placeholder="Profession (e.g. Developer)" required className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, job: e.target.value})} />
          <div className="flex gap-4">
            <input type="number" placeholder="Age" required min="13" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 flex-1" onChange={(e) => setFormData({...formData, age: e.target.value})} />
            <select className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 flex-1" onChange={(e) => setFormData({...formData, relationshipStatus: e.target.value})} value={formData.relationshipStatus}>
              <option value="Single">Single</option>
              <option value="In a Relationship">In a Relationship</option>
              <option value="Married">Married</option>
            </select>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Saving..." : "Finish & Explore"}
          </button>
        </form>
      </div>
    </div>
  );
}