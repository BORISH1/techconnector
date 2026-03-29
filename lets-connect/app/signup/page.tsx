"use client";
import { useState } from 'react';
import { authClient } from '../lib/auth'; 
import Link from 'next/link';

export default function SignUp() {
  // UI State to switch between Registration and Verification
  const [step, setStep] = useState<"register" | "verify">("register");
  
  // Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Loading & Error States
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // STEP 1: Create Account & Trigger Verification Email
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      }, {
        onSuccess: () => {
          setIsLoading(false);
          // Instead of redirecting, we switch the UI to ask for the code
          setStep("verify");
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "Failed to register. Please try again.");
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError("Network error. Please check your connection.");
    }
  };

  // STEP 2: Verify the Code sent to their email
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Better Auth / Neon Auth standard method for checking OTP
      await authClient.emailOtp.verifyEmail({
        email,
        otp: verificationCode
      }, {
        onSuccess: () => {
          // Success! Now we can redirect them to set up their profile
          window.location.href = "/profile-setup";
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "Invalid or expired code.");
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError("Verification failed due to a network error.");
    }
  };

  // GOOGLE LOGIN (Direct Redirect Method to bypass CORS/VPN issues)
  const handleGoogleLogin = () => {
    const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
    const callback = `${window.location.origin}/profile-setup`;
    if (!authUrl) return setError("Auth URL missing in .env file");
    
    window.location.href = `${authUrl}/sign-in/social?provider=google&callbackURL=${callback}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        {/* --- REGISTRATION STEP --- */}
        {step === "register" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-black text-blue-600 tracking-tighter italic">Connect</h2>
              <p className="text-slate-500 mt-2">Create your account</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                <input 
                  type="text" placeholder="John Doe" required 
                  className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white" 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
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
                {isLoading ? "Sending Code..." : "Create Account"}
              </button>
            </form>

            <div className="relative flex items-center py-6 text-slate-400">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 text-xs uppercase font-bold text-slate-300">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 border border-slate-300 py-3 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700 bg-white">
              <img src="https://www.gstatic.com/images/branding/googleg/svg/google__g_logo.svg" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already a member? <Link href="/signin" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
          </>
        )}

        {/* --- VERIFICATION STEP --- */}
        {step === "verify" && (
          <div className="text-center">
             <h2 className="text-2xl font-black text-slate-900 mb-2">Check your email</h2>
             <p className="text-slate-500 mb-6 text-sm">We sent a 6-digit verification code to <span className="font-bold text-slate-800">{email}</span>.</p>
             
             {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

             <form onSubmit={handleVerifyCode} className="space-y-4">
                <input 
                  type="text" placeholder="Enter Code" required maxLength={6}
                  className="w-full p-4 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center text-2xl tracking-[0.5em] font-bold" 
                  onChange={(e) => setVerificationCode(e.target.value)} 
                />
                <button disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 shadow-lg transition-all disabled:opacity-50">
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </button>
             </form>
             
             <button onClick={() => setStep("register")} className="mt-6 text-sm text-slate-500 hover:text-slate-800 transition-all font-medium">
                Wrong email address? Go back.
             </button>
          </div>
        )}

      </div>
    </div>
  );
}