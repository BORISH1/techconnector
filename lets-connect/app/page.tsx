import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo/Brand Section */}
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight">
            Connect
          </h1>
          <p className="text-slate-600 text-lg">
            Share photos, update your status, and stay close with friends.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 space-y-4">
          <Link href="/signup" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Create New Account
          </Link>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <Link href="/signin" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition-colors border border-slate-300">
            Log In
          </Link>
        </div>

        {/* Footer info */}
        <p className="text-slate-400 text-sm">
          Join thousands of users on the Connect network.
        </p>
      </div>
    </div>
  );
}