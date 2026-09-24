// app/signup/page.tsx
"use client";
import { useState } from 'react';
import { authClient } from '../lib/auth'; 
import Link from 'next/link';

export default function SignUp() {
  const [step, setStep] = useState<"register" | "verify">("register");
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Trigger Verification Email
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await authClient.signUp.email({ email, password, name }, {
        onSuccess: () => {
          setIsLoading(false);
          setStep("verify"); // Move to code entry
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "Failed to register.");
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError("Network blocked the request. Please turn on your VPN.");
    }
  };

  // 2. Verify the Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authClient.emailOtp.verifyEmail({ email, otp: verificationCode }, {
        onSuccess: () => {
          window.location.href = "/profile-setup"; // Success!
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "Invalid or expired code.");
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError("Network error during verification.");
    }
  };

  // 3. Google Login
  const handleGoogleLogin = () => {
    const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
    const callback = `${window.location.origin}/profile-setup`;
    window.location.href = `${authUrl}/sign-in/social?provider=google&callbackURL=${callback}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        {step === "register" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-black text-blue-600 italic">Connect</h2>
              <p className="text-slate-500 mt-2">Create your account</p>
            </div>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
            
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Email Address" required className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" required className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setPassword(e.target.value)} />
              <button disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                {isLoading ? "Sending Code..." : "Create Account"}
              </button>
            </form>

            <div className="relative flex items-center py-6 text-slate-400">
              <div className="flex-grow border-t"></div>
              <span className="mx-4 text-xs uppercase font-bold text-slate-300">Or</span>
              <div className="flex-grow border-t"></div>
            </div>

            <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 border border-slate-300 py-3 rounded-xl hover:bg-slate-50 font-semibold text-slate-700">
              <img src="https://www.gstatic.com/images/branding/googleg/svg/google__g_logo.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            <p className="mt-6 text-center text-sm text-slate-500">Already a member? <Link href="/signin" className="text-blue-600 font-bold hover:underline">Log In</Link></p>
          </>
        )}

        {step === "verify" && (
          <div className="text-center">
             <h2 className="text-2xl font-black text-slate-900 mb-2">Check your email</h2>
             <p className="text-slate-500 mb-6 text-sm">We sent a 6-digit verification code to <span className="font-bold text-slate-800">{email}</span>.</p>
             {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
             <form onSubmit={handleVerifyCode} className="space-y-4">
                <input type="text" placeholder="Enter Code" required maxLength={6} className="w-full p-4 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-[0.5em] font-bold" onChange={(e) => setVerificationCode(e.target.value)} />
                <button disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50">
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </button>
             </form>
             <button onClick={() => setStep("register")} className="mt-6 text-sm text-slate-500 hover:text-slate-800 font-medium">Wrong email address? Go back.</button>
          </div>
        )}
      </div>
    </div>
  );
}