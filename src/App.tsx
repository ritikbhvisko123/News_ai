import React, { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw,
  Search,
  Sparkles,
  ChevronDown,
  AlertCircle,
  Inbox,
  Flame,
} from 'lucide-react';
import { NewsArticle, NewsCategory, NewsLanguage, IndoreWeather, AppTheme } from './types/news.ts';
import {
  useNewsStorage,
  cacheFeedArticles,
  getCachedFeedArticles,
} from './hooks/useNewsStorage.ts';
import { useOnlineStatus } from './hooks/useOnlineStatus.ts';
import { Header } from './components/Header.tsx';
import { CategoryNav } from './components/CategoryNav.tsx';
import { BreakingBanner } from './components/BreakingBanner.tsx';
import { ArticleCard } from './components/ArticleCard.tsx';
import { ReadingModeModal } from './components/ReadingModeModal.tsx';
import { TodaysDigestModal } from './components/TodaysDigestModal.tsx';
import { SavedArticlesModal } from './components/SavedArticlesModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';

export default function App() {
  const {
    bookmarks,
    history,
    preferences,
    toggleBookmark,
    isBookmarked,
    addToHistory,
    clearHistory,
    updatePreferences,
  } = useNewsStorage();

  const isOnline = useOnlineStatus();

  const [activeCategory, setActiveCategory] = useState<NewsCategory>('top');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [weather, setWeather] = useState<IndoreWeather | undefined>();
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [showDigestModal, setShowDigestModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Apply Theme & Language body classes
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-dark', 'theme-sepia', 'theme-light');

    let currentTheme = preferences.theme;
    if (preferences.autoNightMode && currentTheme !== 'sepia') {
      const hour = new Date().getHours();
      // Night mode between 20:00 (8 PM) and 06:00 (6 AM)
      if (hour >= 20 || hour < 6) {
        currentTheme = 'dark';
      }
    }

    if (currentTheme === 'dark') {
      body.classList.add('theme-dark');
    } else if (currentTheme === 'sepia') {
      body.classList.add('theme-sepia');
    } else {
      body.classList.add('theme-light');
    }

    // Language class for Devanagari typography
    if (preferences.language === 'hi') {
      body.classList.add('lang-hi');
      document.documentElement.lang = 'hi';
    } else {
      body.classList.remove('lang-hi');
      document.documentElement.lang = 'en';
    }
  }, [preferences.theme, preferences.language, preferences.autoNightMode]);

  // Fetch News Feed on category, language, or search change
  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      setPage(1);
      setLoading(true);

      try {
        const queryParams = new URLSearchParams({
          category: activeCategory,
          language: preferences.language,
          page: '1',
          search: searchQuery.trim(),
        });

        const res = await fetch(`/api/news?${queryParams.toString()}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        if (!isCancelled) {
          const incomingArticles: NewsArticle[] = data.articles || [];
          setArticles(incomingArticles);
          setBreakingNews(data.breakingNews || []);
          if (data.weather) setWeather(data.weather);
          setTotalArticles(data.total || 0);

          // Cache feed for offline reading
          cacheFeedArticles(activeCategory, preferences.language, incomingArticles);
        }
      } catch (err) {
        console.warn('Network fetch error, loading from local offline cache:', err);
        if (!isCancelled) {
          const cached = getCachedFeedArticles(activeCategory, preferences.language);
          if (cached && cached.length > 0) {
            setArticles(cached);
            setBreakingNews(cached.filter((a) => a.isBreaking));
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [activeCategory, preferences.language, searchQuery]);

  // Handle Load More
  const handleLoadMore = async () => {
    if (loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const queryParams = new URLSearchParams({
        category: activeCategory,
        language: preferences.language,
        page: String(nextPage),
        search: searchQuery.trim(),
      });

      const res = await fetch(`/api/news?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      const incomingArticles: NewsArticle[] = data.articles || [];

      setArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const fresh = incomingArticles.filter((a) => !existingIds.has(a.id));
        return [...prev, ...fresh];
      });
      setPage(nextPage);
      setTotalArticles(data.total || 0);
    } catch (err) {
      console.warn('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/refresh', { method: 'POST' });
    } catch {
      // ignore
    }

    try {
      const queryParams = new URLSearchParams({
        category: activeCategory,
        language: preferences.language,
        page: '1',
        search: searchQuery.trim(),
      });

      const res = await fetch(`/api/news?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const incomingArticles: NewsArticle[] = data.articles || [];
        setArticles(incomingArticles);
        setBreakingNews(data.breakingNews || []);
        if (data.weather) setWeather(data.weather);
        setTotalArticles(data.total || 0);
        setPage(1);
        cacheFeedArticles(activeCategory, preferences.language, incomingArticles);
      }
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Switch Theme Cycle: light -> dark -> sepia -> light
  const handleCycleTheme = () => {
    const order: AppTheme[] = ['light', 'dark', 'sepia'];
    const nextIdx = (order.indexOf(preferences.theme) + 1) % order.length;
    updatePreferences({ theme: order[nextIdx] });
  };

  // Open Reading Mode
  const handleOpenArticle = (article: NewsArticle) => {
    setActiveArticle(article);
    addToHistory(article);
  };

  const featuredArticle = useMemo(() => {
    return articles.length > 0 ? articles[0] : null;
  }, [articles]);

  const regularArticles = useMemo(() => {
    return articles.length > 1 ? articles.slice(1) : [];
  }, [articles]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-red-500 selection:text-white pb-20 md:pb-8">
      {/* Offline notification badge */}
      <OfflineIndicator language={preferences.language} />

      {/* Sticky Main Header */}
      <Header
        language={preferences.language}
        onToggleLanguage={(lang) => updatePreferences({ language: lang })}
        theme={preferences.theme}
        onToggleTheme={handleCycleTheme}
        weather={weather}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDigest={() => setShowDigestModal(true)}
        onOpenBookmarks={() => setShowSavedModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onRefreshFeeds={handleRefresh}
        isRefreshing={isRefreshing}
        savedCount={bookmarks.length}
      />

      {/* Breaking News Ticker */}
      <BreakingBanner
        breakingArticles={breakingNews}
        language={preferences.language}
        onArticleClick={handleOpenArticle}
      />

      {/* Categories Bar */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        language={preferences.language}
        onOpenDigest={() => setShowDigestModal(true)}
        onOpenBookmarks={() => setShowSavedModal(true)}
        savedCount={bookmarks.length}
      />

      {/* Main News Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Search status notification if searching */}
        {searchQuery && (
          <div className="mb-6 p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-200 flex items-center justify-between">
            <span>
              {preferences.language === 'hi' ? 'खोज परिणाम:' : 'Search results for:'}{' '}
              <strong>"{searchQuery}"</strong> ({articles.length}{' '}
              {preferences.language === 'hi' ? 'खबरें' : 'articles'})
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-red-600 font-bold hover:underline"
            >
              {preferences.language === 'hi' ? 'हटाएं' : 'Clear search'}
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-72 sm:h-96 rounded-3xl bg-gray-200 dark:bg-gray-800 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-24 text-center">
            <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {preferences.language === 'hi' ? 'कोई खबर नहीं मिली' : 'No articles found'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {preferences.language === 'hi'
                ? 'कृपया दूसरी श्रेणी चुनें या ताज़ा करें।'
                : 'Please try another category or refresh the feed.'}
            </p>
            <button
              onClick={handleRefresh}
              className="mt-5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{preferences.language === 'hi' ? 'पुनः प्रयास करें' : 'Refresh News'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Featured Hero Story (Only on Top page 1 or category page 1 if no search) */}
            {!searchQuery && page === 1 && featuredArticle && (
              <ArticleCard
                article={featuredArticle}
                language={preferences.language}
                isBookmarked={isBookmarked(featuredArticle.id, featuredArticle.title)}
                onToggleBookmark={toggleBookmark}
                onOpenArticle={handleOpenArticle}
                onQuickListen={handleOpenArticle}
                featured={true}
              />
            )}

            {/* Grid of Articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || page > 1 ? articles : regularArticles).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  language={preferences.language}
                  isBookmarked={isBookmarked(article.id, article.title)}
                  onToggleBookmark={toggleBookmark}
                  onOpenArticle={handleOpenArticle}
                  onQuickListen={handleOpenArticle}
                />
              ))}
            </div>

            {/* Load More Button */}
            {articles.length < totalArticles && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 text-gray-800 dark:text-gray-200 font-bold text-sm shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                      <span>{preferences.language === 'hi' ? 'लोड हो रहा है...' : 'Loading more...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{preferences.language === 'hi' ? 'और अधिक खबरें लोड करें' : 'Load More Stories'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 py-8 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-900 dark:text-white">
              {preferences.language === 'hi' ? 'इंदौर & बियॉन्ड' : 'Indore & Beyond'}
            </span>
            <span>—</span>
            <span>
              {preferences.language === 'hi'
                ? 'स्वच्छ शहर इंदौर, भारत और विश्व की दैनिक निष्पक्ष खबरें'
                : 'Daily journalism for Indore, India & the World'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>PWA & Android Ready</span>
            <span>•</span>
            <span>Auto Refresh (6:00 AM IST)</span>
            <span>•</span>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-red-600 hover:underline cursor-pointer"
            >
              {preferences.language === 'hi' ? 'सेटिंग्स' : 'Settings'}
            </button>
          </div>
        </div>
      </footer>

      {/* Dedicated Reading Mode Modal */}
      {activeArticle && (
        <ReadingModeModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
          language={preferences.language}
          isBookmarked={isBookmarked(activeArticle.id, activeArticle.title)}
          onToggleBookmark={toggleBookmark}
          fontSize={preferences.fontSize}
          fontFamily={preferences.fontFamily}
          onChangeFontSize={(delta) =>
            updatePreferences({ fontSize: Math.max(15, Math.min(26, preferences.fontSize + delta)) })
          }
          onToggleFontFamily={() =>
            updatePreferences({ fontFamily: preferences.fontFamily === 'serif' ? 'sans' : 'serif' })
          }
          onSelectArticle={handleOpenArticle}
          allArticles={articles}
        />
      )}

      {/* Today's Digest Modal */}
      <TodaysDigestModal
        isOpen={showDigestModal}
        onClose={() => setShowDigestModal(false)}
        language={preferences.language}
        onSelectArticle={handleOpenArticle}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
      />

      {/* Saved Articles & History Modal */}
      <SavedArticlesModal
        isOpen={showSavedModal}
        onClose={() => setShowSavedModal(false)}
        bookmarks={bookmarks}
        history={history}
        language={preferences.language}
        onSelectArticle={handleOpenArticle}
        onRemoveBookmark={toggleBookmark}
        onClearHistory={clearHistory}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
      />
    </div>
  );
}
