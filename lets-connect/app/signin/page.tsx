"use client";
import { useState } from 'react';
import { authClient } from '../lib/auth';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await authClient.signIn.email({
      email, password,
      callbackURL: '/feed',
    });
    if (error) setError(error.message || 'An error occurred');
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/feed",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 italic tracking-tighter">Connect</h2>
        
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}

        <form onSubmit={handleEmailSignIn} className="space-y-4 text-left">
          <input type="email" placeholder="Email" required className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">Log In</button>
        </form>

        <button onClick={handleGoogleLogin} className="w-full mt-4 flex items-center justify-center gap-3 border border-slate-300 py-3 rounded-xl hover:bg-slate-50 transition-all font-semibold">
          <img src="https://www.gstatic.com/images/branding/googleg/svg/google__g_logo.svg" className="w-5 h-5" alt="Google" />
          Log in with Google
        </button>

        <p className="mt-8 text-sm text-slate-600">
          New to Connect? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}