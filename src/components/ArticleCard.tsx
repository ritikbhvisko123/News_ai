import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Share2, Volume2, ArrowRight, Clock, Check, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types/news.ts';

interface ArticleCardProps {
  article: NewsArticle;
  language: 'hi' | 'en';
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onOpenArticle: (article: NewsArticle) => void;
  onQuickListen?: (article: NewsArticle) => void;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  language,
  isBookmarked,
  onToggleBookmark,
  onOpenArticle,
  onQuickListen,
  featured = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: article.title,
      text: `${article.title}\n\n${article.summary}`,
      url: article.url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${article.title}\n${article.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`*${article.title}*\n\n${article.summary}\n\nRead more: ${article.url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const fallbackImg =
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';

  if (featured) {
    return (
      <article
        onClick={() => onOpenArticle(article)}
        className="group relative bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer mb-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto min-h-[280px]">
            <img
              src={imgError ? fallbackImg : article.imageUrl || fallbackImg}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {language === 'hi' ? 'विशेष खबर' : 'FEATURED STORY'}
              </span>
              {article.isBreaking && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  {language === 'hi' ? 'ब्रेकिंग' : 'BREAKING'}
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="font-semibold text-red-600 dark:text-red-400">{article.source}</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.timeAgo}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug mb-3">
                {article.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed mb-4">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(article);
                  }}
                  className={`p-2 rounded-full border transition-colors ${
                    isBookmarked
                      ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                </button>

                {onQuickListen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickListen(article);
                    }}
                    className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title={language === 'hi' ? 'समाचार सुनें' : 'Listen aloud'}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Share"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
                <span>{language === 'hi' ? 'विस्तार से पढ़ें' : 'Read Article'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onOpenArticle(article)}
      className="group bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={imgError ? fallbackImg : article.imageUrl || fallbackImg}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              {article.source}
            </span>
            {article.isBreaking && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {language === 'hi' ? 'ब्रेकिंग' : 'BREAKING'}
              </span>
            )}
          </div>
          {article.readTimeMinutes && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
              {article.readTimeMinutes} {language === 'hi' ? 'मिनट' : 'min'}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.timeAgo}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug line-clamp-2 mb-2">
            {article.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-red-600 bg-red-50 dark:bg-red-950/50'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            title="Bookmark"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {onQuickListen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickListen(article);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Listen"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Share"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="WhatsApp"
          >
            <span className="font-bold text-[11px] text-emerald-600">WA</span>
          </button>
        </div>

        <span className="text-red-600 dark:text-red-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          <span>{language === 'hi' ? 'पढ़ें' : 'Read'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
