import { useState, useEffect, useCallback } from 'react';
import { NewsArticle, NewsLanguage, AppTheme } from '../types/news.ts';

const SAVED_ARTICLES_KEY = 'indore_news_bookmarks';
const HISTORY_KEY = 'indore_news_history';
const CACHE_FEED_KEY = 'indore_news_feed_cache';
const PREFS_KEY = 'indore_news_preferences';

export interface UserPreferences {
  language: NewsLanguage;
  theme: AppTheme;
  fontSize: number; // 16, 18, 20, 22, 24
  fontFamily: 'serif' | 'sans';
  autoNightMode: boolean;
  pushNotificationsEnabled: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  language: 'hi',
  theme: 'light',
  fontSize: 19,
  fontFamily: 'serif',
  autoNightMode: true,
  pushNotificationsEnabled: false,
};

// Stable top-level localStorage cache helpers
export const cacheFeedArticles = (category: string, lang: string, articles: NewsArticle[]) => {
  try {
    const key = `${CACHE_FEED_KEY}_${lang}_${category}`;
    localStorage.setItem(key, JSON.stringify(articles));
  } catch (e) {
    console.warn('Offline cache write failed:', e);
  }
};

export const getCachedFeedArticles = (category: string, lang: string): NewsArticle[] => {
  try {
    const key = `${CACHE_FEED_KEY}_${lang}_${category}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export function useNewsStorage() {
  const [bookmarks, setBookmarks] = useState<NewsArticle[]>(() => {
    try {
      const data = localStorage.getItem(SAVED_ARTICLES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<NewsArticle[]>(() => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const data = localStorage.getItem(PREFS_KEY);
      return data ? { ...DEFAULT_PREFS, ...JSON.parse(data) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [preferences]);

  const toggleBookmark = useCallback((article: NewsArticle) => {
    setBookmarks((prev) => {
      const exists = prev.some((a) => a.id === article.id || a.title === article.title);
      if (exists) {
        return prev.filter((a) => a.id !== article.id && a.title !== article.title);
      } else {
        return [article, ...prev];
      }
    });
  }, []);

  const isBookmarked = useCallback(
    (articleId: string, articleTitle: string): boolean => {
      return bookmarks.some((a) => a.id === articleId || a.title === articleTitle);
    },
    [bookmarks]
  );

  const addToHistory = useCallback((article: NewsArticle) => {
    setHistory((prev) => {
      const filtered = prev.filter((a) => a.id !== article.id);
      return [article, ...filtered].slice(0, 40);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...partial }));
  }, []);

  return {
    bookmarks,
    history,
    preferences,
    toggleBookmark,
    isBookmarked,
    addToHistory,
    clearHistory,
    updatePreferences,
    cacheFeedArticles,
    getCachedFeedArticles,
  };
}
