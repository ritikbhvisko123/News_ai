import React, { useState, useEffect } from 'react';
import { Flame, ChevronRight, Zap } from 'lucide-react';
import { NewsArticle } from '../types/news.ts';

interface BreakingBannerProps {
  breakingArticles: NewsArticle[];
  language: 'hi' | 'en';
  onArticleClick: (article: NewsArticle) => void;
}

export const BreakingBanner: React.FC<BreakingBannerProps> = ({
  breakingArticles,
  language,
  onArticleClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (breakingArticles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingArticles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [breakingArticles.length]);

  if (!breakingArticles || breakingArticles.length === 0) return null;

  const current = breakingArticles[currentIndex] || breakingArticles[0];

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
          </span>
          <span className="bg-black/25 backdrop-blur-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded text-[10px] sm:text-xs flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            {language === 'hi' ? 'ताज़ा खबर' : 'BREAKING'}
          </span>
        </div>

        <button
          onClick={() => onArticleClick(current)}
          className="flex-1 text-left truncate font-medium hover:underline flex items-center gap-1.5 group cursor-pointer"
        >
          <span className="truncate">{current.title}</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>

        {breakingArticles.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 flex-shrink-0 text-[11px] opacity-80 font-mono">
            <span>{currentIndex + 1}</span>/<span>{breakingArticles.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};
