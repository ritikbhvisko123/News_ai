import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  Coffee,
  Languages,
  Bell,
  Smartphone,
  ShieldCheck,
  Check,
  Type,
  BellRing,
} from 'lucide-react';
import { AppTheme, NewsLanguage } from '../types/news.ts';
import { UserPreferences } from '../hooks/useNewsStorage.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (partial: Partial<UserPreferences>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  const [notifGranted, setNotifGranted] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  if (!isOpen) return null;

  const handleRequestNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifGranted(true);
        onUpdatePreferences({ pushNotificationsEnabled: true });
        // Trigger a test greeting
        new Notification(
          preferences.language === 'hi' ? 'इंदौर समाचार दैनिक' : 'Indore & Beyond News',
          {
            body:
              preferences.language === 'hi'
                ? 'दैनिक सुबह 6:00 बजे और ताज़ा ब्रेकिंग अलर्ट सक्रिय हो गए हैं!'
                : 'Daily 6:00 AM digest and breaking alerts are now active!',
            icon: '/pwa-192x192.png',
          }
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
            {preferences.language === 'hi' ? 'ऐप सेटिंग्स' : 'App Settings & Preferences'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Language Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
              {preferences.language === 'hi' ? 'भाषा (Language)' : 'Language'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdatePreferences({ language: 'hi' })}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${
                  preferences.language === 'hi'
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {preferences.language === 'hi' && <Check className="w-4 h-4 text-red-600" />}
              </button>
              <button
                onClick={() => onUpdatePreferences({ language: 'en' })}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${
                  preferences.language === 'en'
                    ? 'border-red-600 bg-red-50/50 dark:bg-red-950/40 text-red-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>English</span>
                {preferences.language === 'en' && <Check className="w-4 h-4 text-red-600" />}
              </button>
            </div>
          </div>

          {/* Reading Themes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
              {preferences.language === 'hi' ? 'रीडिंग थीम (Theme)' : 'Reading Theme'}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => onUpdatePreferences({ theme: 'light' })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  preferences.theme === 'light'
                    ? 'border-red-600 bg-red-50/60 dark:bg-red-950/40 text-red-600 shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>{preferences.language === 'hi' ? 'लाइट' : 'Light'}</span>
              </button>

              <button
                onClick={() => onUpdatePreferences({ theme: 'dark' })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  preferences.theme === 'dark'
                    ? 'border-red-600 bg-red-50/60 dark:bg-red-950/40 text-red-600 shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span>{preferences.language === 'hi' ? 'डार्क' : 'Dark'}</span>
              </button>

              <button
                onClick={() => onUpdatePreferences({ theme: 'sepia' })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  preferences.theme === 'sepia'
                    ? 'border-amber-600 bg-amber-100/70 text-amber-900 shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Coffee className="w-5 h-5 text-amber-700" />
                <span>{preferences.language === 'hi' ? 'सेपिया (नेत्र-मित्र)' : 'Sepia'}</span>
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
              <span>{preferences.language === 'hi' ? 'रात में स्वतः डार्क मोड (Auto Night Mode)' : 'Auto Night Mode (8 PM - 6 AM)'}</span>
              <input
                type="checkbox"
                checked={preferences.autoNightMode}
                onChange={(e) => onUpdatePreferences({ autoNightMode: e.target.checked })}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Typography defaults */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
              {preferences.language === 'hi' ? 'डिफ़ॉल्ट फॉन्ट आकार' : 'Reading Font'}
            </label>
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <span className="text-sm font-medium">
                {preferences.fontSize}px ({preferences.fontSize >= 20 ? 'Large' : 'Normal'})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdatePreferences({ fontSize: Math.max(16, preferences.fontSize - 1) })}
                  className="px-2.5 py-1 rounded-lg border text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  A-
                </button>
                <button
                  onClick={() => onUpdatePreferences({ fontSize: Math.min(24, preferences.fontSize + 1) })}
                  className="px-2.5 py-1 rounded-lg border text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
              {preferences.language === 'hi' ? 'सूचनाएं (Push Notifications)' : 'Push Notifications'}
            </label>
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {preferences.language === 'hi' ? 'दैनिक सुबह 6:00 AM डाइजेस्ट' : 'Morning 6:00 AM IST Digest'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {preferences.language === 'hi'
                        ? 'हर सुबह इंदौर व देश की शीर्ष 10 खबरों का संक्षिप्त नोटिफिकेशन प्राप्त करें।'
                        : 'Get a quick notification every morning with top 10 handpicked headlines.'}
                    </p>
                  </div>
                </div>

                {notifGranted ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                    {preferences.language === 'hi' ? 'सक्रिय' : 'Active'}
                  </span>
                ) : (
                  <button
                    onClick={handleRequestNotifications}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                  >
                    {preferences.language === 'hi' ? 'सक्रिय करें' : 'Enable'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Android App Ready notice */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600/10 via-amber-500/10 to-transparent border border-red-200/60 dark:border-red-900/40 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300 text-sm">
              <Smartphone className="w-4 h-4" />
              <span>{preferences.language === 'hi' ? 'एंड्रॉयड ऐप तैयार (Capacitor Ready)' : 'Android App Ready (Capacitor)'}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {preferences.language === 'hi'
                ? 'यह ऐप PWA के रूप में तुरंत इंस्टॉल हो सकता है और Capacitor कॉन्फ़िगरेशन के साथ सीधे Android Studio में APK/AAB बनाया जा सकता है।'
                : 'This app is a full PWA and configured with Capacitor for 1-click APK/AAB compilation in Android Studio.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            {preferences.language === 'hi' ? 'सहेजा गया' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
