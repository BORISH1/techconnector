import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { Users } from 'lucide-react';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
          <Users className="w-8 h-8 text-white" />
        </div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">ConnectPeople</span>
      </div>
      <AuthForm type="login" />
    </div>
  );
};
