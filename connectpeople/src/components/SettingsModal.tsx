import React from 'react';
import { X, Moon, Sun, Type, LogOut, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { useThemeStore, FontSize, Theme } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, fontSize, setTheme, setFontSize, toggleTheme } = useThemeStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    onClose();
  };

  const handleWhatsApp = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = '9612024828'; // Replace with your WhatsApp number
    const message = 'Hi! I need help with TechConnector app.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailSupport = () => {
    const subject = 'TechConnector App Support';
    const body = 'Hi, I need help with the TechConnector app. Please describe my issue here.';
    const emailUrl = `mailto:borishningombam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
  };

  const handleDeveloperContact = () => {
    const subject = 'TechConnector App - Developer Contact';
    const body = 'Hi Developer, I have a question/suggestion about TechConnector app.';
    const emailUrl = `mailto:borishningombam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Theme
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setTheme('light')}
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className={theme === 'light' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                  Light Mode
                </span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className={theme === 'dark' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'}>
                  Dark Mode
                </span>
              </button>
            </div>
          </div>

          {/* Font Size Settings */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Size
            </h3>
            <div className="space-y-2">
              {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    fontSize === size
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span
                    className={`font-medium capitalize ${
                      fontSize === size ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                    style={{
                      fontSize:
                        size === 'small'
                          ? '0.875rem'
                          : size === 'medium'
                            ? '1rem'
                            : '1.125rem',
                    }}
                  >
                    {size}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Support & Contact
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleWhatsApp}
                className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all flex items-center gap-3 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">WhatsApp Support</span>
              </button>
              <button
                onClick={handleEmailSupport}
                className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">Email Support</span>
              </button>
              <button
                onClick={handleDeveloperContact}
                className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all flex items-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Phone className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">Contact Developer</span>
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
