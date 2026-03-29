"use client";
import { useState } from 'react';
import { authClient } from '../lib/auth';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // EMAIL LOGIN
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
          // Send them to the feed on success
          window.location.href = "/feed";
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "Invalid email or password.");
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError("Network error. Please check your connection.");
    }
  };

  // GOOGLE LOGIN (Direct Redirect Method)
  const handleGoogleLogin = () => {
    const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
    const callback = `${window.location.origin}/feed`; // Logged in users go straight to feed
    if (!authUrl) return setError("Auth URL missing in .env file");
    
    window.location.href = `${authUrl}/sign-in/social?provider=google&callbackURL=${callback}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-blue-600 tracking-tighter italic">Connect</h2>
          <p className="text-slate-500 mt-2">Welcome back</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
            <input 
              type="email" placeholder="name@example.com" required 
              className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white" 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <input 
              type="password" placeholder="••••••••" required 
              className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50">
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="relative flex items-center py-6 text-slate-400">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="mx-4 text-xs uppercase font-bold text-slate-300">Or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 border border-slate-300 py-3 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700 bg-white">
          <img src="https://www.gstatic.com/images/branding/googleg/svg/google__g_logo.svg" className="w-5 h-5" alt="Google" />
          Log in with Google
        </button>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}