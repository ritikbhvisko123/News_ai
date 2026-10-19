import React, { useState } from 'react';
import { X, Bookmark, History, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { NewsArticle, NewsLanguage } from '../types/news.ts';

interface SavedArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: NewsArticle[];
  history: NewsArticle[];
  language: NewsLanguage;
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
  onClearHistory: () => void;
}

export const SavedArticlesModal: React.FC<SavedArticlesModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  history,
  language,
  onSelectArticle,
  onRemoveBookmark,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'history'>('saved');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header Tabs */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{language === 'hi' ? 'सुरक्षित खबरें' : 'Saved Articles'}</span>
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-black/20">{bookmarks.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{language === 'hi' ? 'पढ़ा गया इतिहास' : 'History'}</span>
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-black/20">{history.length}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-gray-100 dark:divide-gray-800">
          {activeTab === 'saved' ? (
            bookmarks.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {language === 'hi'
                    ? 'कोई सेव की गई खबर नहीं है। बाद में पढ़ने के लिए बुकमार्क आइकन दबाएं।'
                    : 'No saved articles yet. Bookmark stories from the feed to read offline later.'}
                </p>
              </div>
            ) : (
              bookmarks.map((article) => (
                <div
                  key={article.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectArticle(article);
                  }}
                >
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-400 mb-1">
                      <span className="text-red-600 font-semibold uppercase">{article.category}</span> •{' '}
                      <span>{article.source}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2">
                      {article.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(article);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))
            )
          ) : history.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">
                {language === 'hi' ? 'कोई हालिया इतिहास नहीं है।' : 'No reading history yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-end pb-2">
                <button
                  onClick={onClearHistory}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'इतिहास मिटाएं' : 'Clear history'}</span>
                </button>
              </div>
              {history.map((article) => (
                <div
                  key={article.id}
                  className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex items-center justify-between gap-3 group cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectArticle(article);
                  }}
                >
                  <div className="flex-1">
                    <div className="text-[11px] text-gray-400 mb-1">
                      <span className="text-red-600 font-semibold uppercase">{article.category}</span> •{' '}
                      <span>{article.source}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2">
                      {article.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
