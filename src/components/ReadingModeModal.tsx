import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Check,
  Type,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { NewsArticle, NewsLanguage } from '../types/news.ts';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.ts';

interface ReadingModeModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  language: NewsLanguage;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  fontSize: number;
  fontFamily: 'serif' | 'sans';
  onChangeFontSize: (delta: number) => void;
  onToggleFontFamily: () => void;
  onSelectArticle: (article: NewsArticle) => void;
  allArticles: NewsArticle[];
}

export const ReadingModeModal: React.FC<ReadingModeModalProps> = ({
  article,
  onClose,
  language,
  isBookmarked,
  onToggleBookmark,
  fontSize,
  fontFamily,
  onChangeFontSize,
  onToggleFontFamily,
  onSelectArticle,
  allArticles,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const { speak, pause, resume, stop, isSpeaking, isPaused, rate, changeRate, supported } =
    useSpeechSynthesis();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stop();
    };
  }, [onClose, stop]);

  // Track reading scroll progress
  useEffect(() => {
    const container = contentContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const progress = scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [article]);

  if (!article) return null;

  const handleStartListen = () => {
    const fullTextToRead = `${article.title}. ${article.summary}. ${article.content || ''}`;
    speak(fullTextToRead, article.language || language);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `${article.title}\n\n${article.summary}`,
          url: article.url || window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${article.title}\n${article.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${article.title}*\n\n${article.summary}\n\nRead more: ${article.url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  // Split content into clean paragraphs
  const paragraphs = (article.content || article.summary)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center overflow-hidden animate-fade-in">
      <div
        ref={contentContainerRef}
        className="w-full max-w-4xl bg-white dark:bg-gray-900 overflow-y-auto h-full shadow-2xl flex flex-col relative transition-colors duration-200"
      >
        {/* Sticky reading progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Top Control Bar */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-xs transition-colors">
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 p-1.5 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
          </button>

          {/* Reading Controls Toolbar */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Font size adjuster */}
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl px-1 py-0.5 bg-gray-50 dark:bg-gray-800 text-xs font-semibold">
              <button
                onClick={() => onChangeFontSize(-1)}
                disabled={fontSize <= 15}
                className="px-2 py-1 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="px-1 text-[11px] text-gray-500 dark:text-gray-400">{fontSize}px</span>
              <button
                onClick={() => onChangeFontSize(1)}
                disabled={fontSize >= 26}
                className="px-2 py-1 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Serif / Sans toggle */}
            <button
              onClick={onToggleFontFamily}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                fontFamily === 'serif'
                  ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 font-serif'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={fontFamily === 'serif' ? 'Switch to Sans font' : 'Switch to Serif font'}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-600'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Save article'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors hidden sm:block cursor-pointer"
              title="Share on WhatsApp"
            >
              <span className="font-bold text-xs">WA</span>
            </button>
          </div>
        </header>

        {/* Audio Listen Bar */}
        {supported && (
          <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/40 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-600 text-white">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {language === 'hi' ? 'ऑडियो वाचन (Listen)' : 'Text-to-Speech'}
                </span>
                <span className="hidden sm:inline text-gray-500 dark:text-gray-400 ml-1.5">
                  {language === 'hi' ? '— खबर को बोलकर सुनें' : '— Read aloud'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isSpeaking ? (
                <button
                  onClick={handleStartListen}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'hi' ? 'सुनें' : 'Play'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Waveform animation */}
                  <div className="flex items-center gap-0.5 h-4 px-1">
                    <span className="w-1 bg-red-600 h-3 animate-pulse" />
                    <span className="w-1 bg-red-600 h-4 animate-bounce" />
                    <span className="w-1 bg-red-600 h-2 animate-pulse" />
                    <span className="w-1 bg-red-600 h-4 animate-bounce" />
                  </div>

                  {isPaused ? (
                    <button
                      onClick={resume}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      title="Resume"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={pause}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      title="Pause"
                    >
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}

                  <button
                    onClick={stop}
                    className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300"
                    title="Stop"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                  </button>

                  {/* Speed toggle */}
                  <div className="flex items-center gap-1 ml-1">
                    {[0.9, 1.0, 1.25].map((s) => (
                      <button
                        key={s}
                        onClick={() => changeRate(s)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          rate === s
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Article Body - Single Column Distraction Free */}
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4">
            <span className="uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
              {article.category}
            </span>
            <span>•</span>
            <span className="text-gray-800 dark:text-gray-200">{article.source}</span>
            <span>•</span>
            <span>{article.timeAgo}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>{article.author}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1
            className={`font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight ${
              fontFamily === 'serif' ? 'font-reading-serif' : 'font-reading-sans'
            }`}
            style={{ fontSize: `${fontSize + 8}px` }}
          >
            {article.title}
          </h1>

          {/* Summary Lead in Large text */}
          <div
            className={`p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border-l-4 border-red-600 text-gray-700 dark:text-gray-200 font-medium mb-8 leading-relaxed italic ${
              fontFamily === 'serif' ? 'font-reading-serif' : 'font-reading-sans'
            }`}
            style={{ fontSize: `${fontSize + 1}px` }}
          >
            {article.summary}
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <figure className="mb-8 rounded-2xl overflow-hidden shadow-md">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[460px] object-cover"
              />
              <figcaption className="p-2.5 bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>{language === 'hi' ? 'चित्र साभार / स्रोत:' : 'Image source:'} {article.source}</span>
                <span>{article.category.toUpperCase()}</span>
              </figcaption>
            </figure>
          )}

          {/* Article Main Text */}
          <div
            className={`space-y-6 text-gray-800 dark:text-gray-200 leading-[1.8] ${
              fontFamily === 'serif' ? 'font-reading-serif' : 'font-reading-sans'
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {paragraphs.map((p, idx) => (
              <p key={idx} className="first-letter:font-bold first-letter:text-red-600">
                {p}
              </p>
            ))}
          </div>

          {/* Source Link & Action footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-bold hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white transition-colors"
            >
              <span>{language === 'hi' ? 'मूल स्रोत पर पूरी खबर देखें' : 'Read Full Original Article'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(article)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-600'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                <span>{isBookmarked ? (language === 'hi' ? 'सुरक्षित है' : 'Saved') : (language === 'hi' ? 'सेव करें' : 'Save')}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'hi' ? 'शेयर' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Related Category Stories */}
          {relatedArticles.length > 0 && (
            <div className="mt-14 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {language === 'hi' ? 'इसी श्रेणी की अन्य प्रमुख खबरें' : 'More from this category'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      stop();
                      onSelectArticle(rel);
                    }}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer group bg-gray-50/50 dark:bg-gray-800/40"
                  >
                    <div className="text-[10px] text-gray-400 mb-1">{rel.source}</div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2">
                      {rel.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
