export type NewsCategory = 'top' | 'indore' | 'india' | 'world' | 'technology';

export type NewsLanguage = 'hi' | 'en';

export type AppTheme = 'light' | 'dark' | 'sepia' | 'system';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string; // ISO string
  timeAgo?: string;
  category: NewsCategory;
  language: NewsLanguage;
  isBreaking?: boolean;
  author?: string;
  readTimeMinutes?: number;
}

export interface IndoreWeather {
  temperature: number;
  condition: string;
  conditionHindi: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  high: number;
  low: number;
  aqiEstimate?: string;
  updatedAt: string;
}

export interface NewsResponse {
  category: NewsCategory;
  language: NewsLanguage;
  total: number;
  page: number;
  articles: NewsArticle[];
  breakingNews: NewsArticle[];
  lastUpdated: string;
  weather?: IndoreWeather;
}

export interface DigestResponse {
  date: string;
  language: NewsLanguage;
  stories: NewsArticle[];
}
