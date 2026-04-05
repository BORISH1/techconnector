import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Moon, Sun, Type, LogOut, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { useThemeStore, FontSize } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export const SettingsPage: React.FC = () => {
  const { theme, fontSize, setTheme, setFontSize } = useThemeStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleWhatsApp = () => {
    const phoneNumber = '9612024828';
    const message = 'Hi! I need help with ConnectPeople app.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailSupport = () => {
    const subject = 'ConnectPeople App Support';
    const body = 'Hi, I need help with the ConnectPeople app. Please describe my issue here.';
    const emailUrl = `mailto:borishningombam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
  };

  const handleDeveloperContact = () => {
    const subject = 'ConnectPeople App - Developer Contact';
    const body = 'Hi Developer, I have a question/suggestion about ConnectPeople app.';
    const emailUrl = `mailto:borishningombam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Control app themes, support options, and account settings.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Back"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold">Theme</h2>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setTheme('light')}
                className={`w-full text-left p-4 rounded-3xl border transition-colors flex items-center gap-3 ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className={`font-medium ${theme === 'light' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  Light Mode
                </span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`w-full text-left p-4 rounded-3xl border transition-colors flex items-center gap-3 ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className={`font-medium ${theme === 'dark' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  Dark Mode
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Type className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold">Font Size</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`rounded-3xl p-4 border transition-all ${
                    fontSize === size
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-6">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold">Support & Contact</h2>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleWhatsApp}
                className="w-full text-left rounded-3xl border border-green-200 bg-white dark:bg-gray-900 dark:border-green-800 px-4 py-4 flex items-center gap-3 hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">WhatsApp Support</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Open chat with support.</div>
                </div>
              </button>
              <button
                onClick={handleEmailSupport}
                className="w-full text-left rounded-3xl border border-blue-200 bg-white dark:bg-gray-900 dark:border-blue-800 px-4 py-4 flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Email Support</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Send a support request via email.</div>
                </div>
              </button>
              <button
                onClick={handleDeveloperContact}
                className="w-full text-left rounded-3xl border border-purple-200 bg-white dark:bg-gray-900 dark:border-purple-800 px-4 py-4 flex items-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors"
              >
                <Phone className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Contact Developer</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Send a message to the app developer.</div>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-3xl bg-red-600 hover:bg-red-700 text-white font-semibold py-4 transition-colors"
          >
            <LogOut className="w-5 h-5 inline-block mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};