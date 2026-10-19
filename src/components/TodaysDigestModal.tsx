import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, ArrowRight, Volume2, Bookmark, Check } from 'lucide-react';
import { NewsArticle, NewsLanguage } from '../types/news.ts';

interface TodaysDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: NewsLanguage;
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked: (id: string, title: string) => boolean;
  onToggleBookmark: (article: NewsArticle) => void;
}

export const TodaysDigestModal: React.FC<TodaysDigestModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [stories, setStories] = useState<NewsArticle[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch(`/api/digest?language=${language}`)
      .then((res) => res.json())
      .then((data) => {
        setStories(data.stories || []);
        setDateStr(data.date || '');
      })
      .catch((err) => {
        console.error('Digest fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, [isOpen, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
                  {language === 'hi' ? 'आज का समाचार सार' : "Today's News Digest"}
                </h2>
                <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  TOP 10
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{dateStr}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-gray-100 dark:divide-gray-800">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400 animate-pulse">
              {language === 'hi' ? 'आज का डाइजेस्ट तैयार किया जा रहा है...' : 'Compiling daily digest...'}
            </div>
          ) : stories.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              {language === 'hi' ? 'डाइजेस्ट उपलब्ध नहीं है' : 'No digest stories available.'}
            </div>
          ) : (
            stories.map((story, idx) => {
              const bookmarked = isBookmarked(story.id, story.title);
              return (
                <div
                  key={story.id || idx}
                  className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 group cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectArticle(story);
                  }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-extrabold text-sm flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                        {story.category}
                      </span>
                      <span>•</span>
                      <span>{story.source}</span>
                      <span>•</span>
                      <span>{story.timeAgo}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug mb-1.5">
                      {story.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2 opacity-80 group-hover:opacity-100 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(story);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        bookmarked
                          ? 'bg-red-50 dark:bg-red-950/60 border-red-300 text-red-600'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex items-center justify-between text-xs text-gray-500">
          <span>{language === 'hi' ? 'ताज़ा 6:00 AM IST अपडेट' : 'Refreshed daily at 6:00 AM IST'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-red-600 transition-colors"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
