import React, { useState } from 'react';
import {
  Newspaper,
  Search,
  Bookmark,
  Sun,
  Moon,
  Coffee,
  RotateCw,
  Sparkles,
  Settings,
  X,
} from 'lucide-react';
import { NewsLanguage, AppTheme, IndoreWeather } from '../types/news.ts';
import { WeatherWidget } from './WeatherWidget.tsx';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface HeaderProps {
  language: NewsLanguage;
  onToggleLanguage: (lang: NewsLanguage) => void;
  theme: AppTheme;
  onToggleTheme: () => void;
  weather?: IndoreWeather;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenDigest: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onRefreshFeeds: () => void;
  isRefreshing: boolean;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  weather,
  searchQuery,
  onSearchChange,
  onOpenDigest,
  onOpenBookmarks,
  onOpenSettings,
  onRefreshFeeds,
  isRefreshing,
  savedCount,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="w-4 h-4 text-indigo-400" />;
    if (theme === 'sepia') return <Coffee className="w-4 h-4 text-amber-700" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/90 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 flex-shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-xl tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5 leading-none">
                <span>{language === 'hi' ? 'इंदौर' : 'Indore'}</span>
                <span className="text-red-600 font-black">{language === 'hi' ? '& बियॉन्ड' : '& Beyond'}</span>
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                {language === 'hi' ? 'नंबर-1 स्वच्छ शहर की दैनिक आवाज़' : "India's Cleanest City Daily"}
              </p>
            </div>
          </div>

          {/* Indore Weather Badge */}
          <div className="hidden sm:block ml-1">
            <WeatherWidget weather={weather} language={language} />
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search bar or search toggle button */}
          {showSearchInput ? (
            <div className="relative flex items-center animate-fade-in">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={language === 'hi' ? 'खबरें खोजें...' : 'Search news...'}
                autoFocus
                className="w-36 sm:w-48 pl-8 pr-7 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchInput(false);
                }}
                className="absolute right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title={language === 'hi' ? 'खोजें' : 'Search'}
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Language Toggle (Always Visible in Header) */}
          <div className="flex items-center p-0.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold">
            <button
              onClick={() => onToggleLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Today's Digest Button */}
          <button
            onClick={onOpenDigest}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
            title="Daily Digest"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'hi' ? 'डाइजेस्ट' : 'Digest'}</span>
          </button>

          {/* Refresh Feed Button */}
          <button
            onClick={onRefreshFeeds}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            title={language === 'hi' ? 'ताज़ा समाचार लोड करें' : 'Refresh news'}
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
          </button>

          {/* Theme Toggle Button (Light / Dark / Sepia) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={`Current theme: ${theme}. Click to switch.`}
          >
            {getThemeIcon()}
          </button>

          {/* Bookmarks Icon (Desktop) */}
          <button
            onClick={onOpenBookmarks}
            className="hidden sm:flex relative p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton language={language} />

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
