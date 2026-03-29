"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    age: '',
    job: '',
    status: 'Single'
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // For now, we log the data. Once the DB is pushed, we link the Server Action.
    console.log("Saving user profile...", formData);
    
    // Simulate a save and redirect to the feed
    setTimeout(() => {
      router.push('/feed');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">One Last Step!</h1>
          <p className="text-slate-500 mt-2">Complete your Connect profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Your Profession</label>
            <input 
              type="text" placeholder="e.g. Student, Designer" required
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, job: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Age</label>
              <input 
                type="number" placeholder="21" required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
              <select 
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option>Single</option>
                <option>Relationship</option>
                <option>Married</option>
              </select>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Finish & Explore"}
          </button>
        </form>
      </div>
    </div>
  );
}