import React from 'react';
import { Newspaper, MapPin, Flag, Globe, Cpu, Sparkles, Bookmark } from 'lucide-react';
import { NewsCategory } from '../types/news.ts';

interface CategoryNavProps {
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  language: 'hi' | 'en';
  onOpenDigest: () => void;
  onOpenBookmarks: () => void;
  savedCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  language,
  onOpenDigest,
  onOpenBookmarks,
  savedCount,
}) => {
  const categories: { id: NewsCategory; labelHi: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'top',
      labelHi: 'मुख्य समाचार',
      labelEn: 'Top Stories',
      icon: <Newspaper className="w-4 h-4" />,
    },
    {
      id: 'indore',
      labelHi: 'इंदौर व मालवा',
      labelEn: 'Indore',
      icon: <MapPin className="w-4 h-4 text-red-500" />,
    },
    {
      id: 'india',
      labelHi: 'भारत',
      labelEn: 'India',
      icon: <Flag className="w-4 h-4 text-orange-500" />,
    },
    {
      id: 'world',
      labelHi: 'विश्व',
      labelEn: 'World',
      icon: <Globe className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'technology',
      labelHi: 'टेक्नोलॉजी',
      labelEn: 'Technology',
      icon: <Cpu className="w-4 h-4 text-indigo-500" />,
    },
  ];

  return (
    <>
      {/* Desktop / Tablet category navigation bar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-[60px] z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2 py-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className={isActive ? 'text-white' : ''}>{cat.icon}</span>
                  <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onOpenDigest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'hi' ? 'आज का डाइजेस्ट' : "Today's Digest"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-6 gap-1 items-center">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-red-600 dark:text-red-400 font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-1 rounded-full ${isActive ? 'bg-red-50 dark:bg-red-950/50' : ''}`}>
                  {cat.icon}
                </div>
                <span className="truncate max-w-[50px]">
                  {language === 'hi' ? cat.labelHi.split(' ')[0] : cat.labelEn.split(' ')[0]}
                </span>
              </button>
            );
          })}

          {/* Bookmarks mobile tab */}
          <button
            onClick={onOpenBookmarks}
            className="flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white relative cursor-pointer"
          >
            <div className="p-1 rounded-full relative">
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </div>
            <span>{language === 'hi' ? 'सेव्ड' : 'Saved'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
