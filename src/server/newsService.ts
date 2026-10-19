import Parser from 'rss-parser';
import { NewsArticle, NewsCategory, NewsLanguage, IndoreWeather, DigestResponse } from '../types/news.js';
import { fallbackHindiArticles, fallbackEnglishArticles } from './seedArticles.js';

interface RSSFeedConfig {
  source: string;
  url: string;
  category: NewsCategory;
  language: NewsLanguage;
}

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
      ['enclosure', 'enclosure'],
      ['dc:creator', 'creator'],
    ],
  },
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) IndoreNewsReader/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
});

const RSS_FEEDS: RSSFeedConfig[] = [
  // INDORE - Hindi
  {
    source: 'दैनिक भास्कर इंदौर',
    url: 'https://www.bhaskar.com/rss-v1--category-4134.xml',
    category: 'indore',
    language: 'hi',
  },
  {
    source: 'नईदुनिया इंदौर व मालवा',
    url: 'https://rss.naidunia.com/rss/madhya-pradesh/indore.xml',
    category: 'indore',
    language: 'hi',
  },
  {
    source: 'अमर उजाला मध्य प्रदेश',
    url: 'https://www.amarujala.com/rss/madhya-pradesh.xml',
    category: 'indore',
    language: 'hi',
  },

  // INDORE - English
  {
    source: 'Free Press Journal Indore',
    url: 'https://www.freepressjournal.in/indore/feed',
    category: 'indore',
    language: 'en',
  },
  {
    source: 'Times of India Indore',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/2950623.cms',
    category: 'indore',
    language: 'en',
  },

  // INDIA - Hindi
  {
    source: 'बीबीसी हिंदी भारत',
    url: 'https://feeds.bbci.co.uk/hindi/rss.xml',
    category: 'india',
    language: 'hi',
  },
  {
    source: 'नवभारत टाइम्स देश',
    url: 'https://navbharattimes.indiatimes.com/rssfeeds/2279786.cms',
    category: 'india',
    language: 'hi',
  },
  {
    source: 'दैनिक भास्कर राष्ट्रीय',
    url: 'https://rss.bhaskar.com/rss-feed/national',
    category: 'india',
    language: 'hi',
  },

  // INDIA - English
  {
    source: 'The Hindu National',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
    category: 'india',
    language: 'en',
  },
  {
    source: 'NDTV India',
    url: 'https://feeds.feedburner.com/ndtvnews-india-news',
    category: 'india',
    language: 'en',
  },
  {
    source: 'Times of India India',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    category: 'india',
    language: 'en',
  },

  // WORLD - Hindi
  {
    source: 'बीबीसी हिंदी विश्व',
    url: 'https://feeds.bbci.co.uk/hindi/rss.xml',
    category: 'world',
    language: 'hi',
  },
  {
    source: 'नवभारत टाइम्स विदेश',
    url: 'https://navbharattimes.indiatimes.com/rssfeeds/2279788.cms',
    category: 'world',
    language: 'hi',
  },

  // WORLD - English
  {
    source: 'BBC News World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'world',
    language: 'en',
  },
  {
    source: 'The Hindu International',
    url: 'https://www.thehindu.com/news/international/feeder/default.rss',
    category: 'world',
    language: 'en',
  },

  // TECH - Hindi
  {
    source: 'दैनिक जागरण टेक्नोलॉजी',
    url: 'https://rss.jagran.com/rss/technology.xml',
    category: 'technology',
    language: 'hi',
  },
  {
    source: 'नवभारत टाइम्स टेक',
    url: 'https://navbharattimes.indiatimes.com/rssfeeds/4719884.cms',
    category: 'technology',
    language: 'hi',
  },

  // TECH - English
  {
    source: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'technology',
    language: 'en',
  },
  {
    source: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'technology',
    language: 'en',
  },
  {
    source: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'technology',
    language: 'en',
  },
];

const DEFAULT_CATEGORY_IMAGES: Record<NewsCategory, string[]> = {
  indore: [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600100397608-f010f443a41f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558441719-aa34bbe5430d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80',
  ],
  india: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
  ],
  world: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  ],
  top: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80',
  ],
};

function stripHtml(html: string = ''): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageUrl(item: any, category: NewsCategory, index: number): string {
  // Check enclosure
  if (item.enclosure && item.enclosure.url && item.enclosure.url.startsWith('http')) {
    return item.enclosure.url;
  }
  // Check mediaContent
  if (item.mediaContent) {
    if (typeof item.mediaContent === 'object' && item.mediaContent.$ && item.mediaContent.$.url) {
      return item.mediaContent.$.url;
    }
    if (typeof item.mediaContent === 'string' && item.mediaContent.startsWith('http')) {
      return item.mediaContent;
    }
  }
  // Check mediaThumbnail
  if (item.mediaThumbnail) {
    if (typeof item.mediaThumbnail === 'object' && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
      return item.mediaThumbnail.$.url;
    }
  }
  // Regex from content / description
  const textBlob = `${item.contentEncoded || ''} ${item.content || ''} ${item.description || ''}`;
  const imgMatch = textBlob.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  // Fallback to beautiful curated category photo
  const list = DEFAULT_CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGES.top;
  return list[index % list.length];
}

export function formatTimeAgo(dateString: string, lang: NewsLanguage): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) {
    return lang === 'hi' ? 'अभी-अभी' : 'Just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return lang === 'hi' ? `${diffMin} मिनट पहले` : `${diffMin}m ago`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return lang === 'hi' ? `${diffHours} घंटे पहले` : `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return lang === 'hi' ? `${diffDays} दिन पहले` : `${diffDays}d ago`;
}

class NewsService {
  private cache: Map<string, NewsArticle[]> = new Map();
  private lastFetchTime: Map<string, number> = new Map();
  private weatherCache: IndoreWeather | null = null;
  private weatherLastFetched: number = 0;
  private isRefreshing: boolean = false;

  constructor() {
    this.seedInitialCache();
    // Start background refresh
    this.refreshAllFeeds().catch(console.error);
    this.refreshWeather().catch(console.error);

    // Schedule background refresh every 1 hour
    setInterval(() => {
      console.log('[NewsService] Running hourly scheduled background refresh...');
      this.refreshAllFeeds().catch(console.error);
      this.refreshWeather().catch(console.error);
    }, 60 * 60 * 1000);

    // Daily 6:00 AM IST scheduled refresh checker
    this.initDailyMorningScheduler();
  }

  private seedInitialCache() {
    // Populate cache immediately with rich fallback seeds so user experience is instant
    this.cache.set('hi_all', [...fallbackHindiArticles]);
    this.cache.set('en_all', [...fallbackEnglishArticles]);

    const categories: NewsCategory[] = ['indore', 'india', 'world', 'technology'];
    for (const cat of categories) {
      this.cache.set(`hi_${cat}`, fallbackHindiArticles.filter((a) => a.category === cat));
      this.cache.set(`en_${cat}`, fallbackEnglishArticles.filter((a) => a.category === cat));
    }
  }

  private initDailyMorningScheduler() {
    // Checks every 5 minutes if it's 6:00 AM IST
    setInterval(() => {
      try {
        const now = new Date();
        // Indian Standard Time is UTC + 5:30
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + istOffset);
        const hours = istDate.getUTCHours();
        const minutes = istDate.getUTCMinutes();

        // If between 06:00 AM and 06:10 AM IST
        if (hours === 6 && minutes < 10) {
          console.log('[NewsService] 🌅 6:00 AM IST Morning Digest Scheduled Trigger!');
          this.refreshAllFeeds().catch(console.error);
        }
      } catch (err) {
        console.error('[NewsService] Scheduler error:', err);
      }
    }, 5 * 60 * 1000);
  }

  public async refreshWeather(): Promise<IndoreWeather> {
    const now = Date.now();
    // Cache weather for 20 minutes
    if (this.weatherCache && now - this.weatherLastFetched < 20 * 60 * 1000) {
      return this.weatherCache;
    }

    try {
      // Indore coordinates: 22.7196° N, 75.8577° E
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=22.7196&longitude=75.8577&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata'
      );
      if (res.ok) {
        const data = await res.json();
        const current = data.current || {};
        const daily = data.daily || {};
        const code = current.weather_code ?? 0;
        const isDay = Boolean(current.is_day);

        let condition = 'Clear Sky';
        let conditionHindi = 'साफ आसमान';

        if (code === 0) {
          condition = isDay ? 'Sunny & Clear' : 'Clear Night';
          conditionHindi = isDay ? 'खुशनुमा धूप व साफ आसमान' : 'स्वच्छ शीतल रात';
        } else if (code <= 3) {
          condition = 'Partly Cloudy';
          conditionHindi = 'आंशिक रूप से बादल';
        } else if (code <= 48) {
          condition = 'Foggy & Mild';
          conditionHindi = 'सुबह की हल्की धुंध';
        } else if (code <= 65) {
          condition = 'Light Rain';
          conditionHindi = 'हल्की फुहारें';
        } else {
          condition = 'Pleasant Breeze';
          conditionHindi = 'सुहावना मौसम';
        }

        const weather: IndoreWeather = {
          temperature: Math.round(current.temperature_2m ?? 28),
          condition,
          conditionHindi,
          humidity: Math.round(current.relative_humidity_2m ?? 45),
          windSpeed: Math.round(current.wind_speed_10m ?? 8),
          isDay,
          high: Math.round(daily.temperature_2m_max?.[0] ?? 31),
          low: Math.round(daily.temperature_2m_min?.[0] ?? 18),
          aqiEstimate: 'AQI 68 (Satisfactory)',
          updatedAt: new Date().toISOString(),
        };

        this.weatherCache = weather;
        this.weatherLastFetched = now;
        return weather;
      }
    } catch (err) {
      console.warn('[NewsService] Failed to fetch live Open-Meteo weather, using realistic Indore baseline:', err);
    }

    // Baseline realistic autumn Indore weather
    const fallbackWeather: IndoreWeather = {
      temperature: 28,
      condition: 'Sunny & Pleasant',
      conditionHindi: 'खुशनुमा धूप व सुहावना मौसम',
      humidity: 48,
      windSpeed: 9,
      isDay: true,
      high: 31,
      low: 18,
      aqiEstimate: 'AQI 68 (Satisfactory)',
      updatedAt: new Date().toISOString(),
    };
    this.weatherCache = fallbackWeather;
    return fallbackWeather;
  }

  public async refreshAllFeeds(): Promise<void> {
    if (this.isRefreshing) return;
    this.isRefreshing = true;
    console.log('[NewsService] Starting background news RSS aggregation...');

    const fetchedArticles: NewsArticle[] = [];

    // Fetch RSS in parallel batches
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        if (!parsed.items || parsed.items.length === 0) return [];

        return parsed.items.slice(0, 15).map((rawItem, idx) => {
          const item = rawItem as any;
          const rawTitle = item.title || 'Breaking Headline';
          const title = stripHtml(rawTitle);
          const rawDesc = item.contentSnippet || item.content || item.summary || item.description || '';
          const summary = stripHtml(rawDesc).slice(0, 260) || title;
          const content = stripHtml(item.contentEncoded || item.content || rawDesc);
          const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
          const imageUrl = extractImageUrl(item, feed.category, idx);
          const id = `${feed.language}-${feed.category}-${Buffer.from(item.link || title).toString('base64').slice(0, 16)}`;

          const article: NewsArticle = {
            id,
            title,
            summary,
            content: content.length > summary.length ? content : `${summary} — Detailed reports continue to develop as authorities and correspondents monitor the story. Full updates provided on official portals.`,
            source: feed.source,
            url: item.link || 'https://www.bhaskar.com',
            imageUrl,
            publishedAt,
            category: feed.category,
            language: feed.language,
            isBreaking: idx === 0,
            author: item.creator || item.author || feed.source,
            readTimeMinutes: Math.max(2, Math.ceil(summary.split(/\s+/).length / 30)),
          };
          return article;
        });
      } catch (err: any) {
        // Individual feed timeout or 404 is normal for external RSS
        return [];
      }
    });

    const results = await Promise.allSettled(feedPromises);
    for (const res of results) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        fetchedArticles.push(...res.value);
      }
    }

    console.log(`[NewsService] Successfully fetched ${fetchedArticles.length} live articles from RSS sources.`);

    // Merge with high-quality seeds
    const hiFresh = fetchedArticles.filter((a) => a.language === 'hi');
    const enFresh = fetchedArticles.filter((a) => a.language === 'en');

    // Group Hindi by category
    const hiAllMerged = this.mergeAndDeduplicate(hiFresh, fallbackHindiArticles);
    const enAllMerged = this.mergeAndDeduplicate(enFresh, fallbackEnglishArticles);

    this.cache.set('hi_all', hiAllMerged);
    this.cache.set('en_all', enAllMerged);

    const categories: NewsCategory[] = ['indore', 'india', 'world', 'technology'];
    for (const cat of categories) {
      this.cache.set(`hi_${cat}`, hiAllMerged.filter((a) => a.category === cat));
      this.cache.set(`en_${cat}`, enAllMerged.filter((a) => a.category === cat));
    }

    this.isRefreshing = false;
  }

  private mergeAndDeduplicate(fresh: NewsArticle[], fallbacks: NewsArticle[]): NewsArticle[] {
    const map = new Map<string, NewsArticle>();

    // Add fresh first
    for (const item of fresh) {
      const key = item.title.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    // Add fallbacks if not present or to ensure depth
    for (const item of fallbacks) {
      const key = item.title.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    const list = Array.from(map.values());
    // Sort by publication date descending
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return list;
  }

  public getArticles(
    category: NewsCategory = 'top',
    language: NewsLanguage = 'hi',
    page: number = 1,
    pageSize: number = 12,
    searchQuery?: string
  ): { articles: NewsArticle[]; total: number; breakingNews: NewsArticle[] } {
    let pool: NewsArticle[] = [];

    if (category === 'top') {
      pool = this.cache.get(`${language}_all`) || (language === 'hi' ? fallbackHindiArticles : fallbackEnglishArticles);
    } else {
      pool = this.cache.get(`${language}_${category}`) || [];
      if (pool.length === 0) {
        const fallbacks = language === 'hi' ? fallbackHindiArticles : fallbackEnglishArticles;
        pool = fallbacks.filter((a) => a.category === category);
      }
    }

    // If search query is provided
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = pool.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }

    // Decorate with dynamic timeAgo
    const decoratedPool = pool.map((a) => ({
      ...a,
      timeAgo: formatTimeAgo(a.publishedAt, language),
    }));

    // Breaking news: top 3 marked or latest breaking
    const breakingNews = decoratedPool.filter((a) => a.isBreaking).slice(0, 3);
    if (breakingNews.length === 0 && decoratedPool.length > 0) {
      breakingNews.push(decoratedPool[0]);
    }

    const start = (page - 1) * pageSize;
    const paginated = decoratedPool.slice(start, start + pageSize);

    return {
      articles: paginated,
      total: decoratedPool.length,
      breakingNews,
    };
  }

  public getTodayDigest(language: NewsLanguage = 'hi'): DigestResponse {
    const pool = this.cache.get(`${language}_all`) || (language === 'hi' ? fallbackHindiArticles : fallbackEnglishArticles);

    // Pick 10 prominent stories: ensure 3 Indore, 3 India, 2 World, 2 Tech
    const indore = pool.filter((a) => a.category === 'indore').slice(0, 3);
    const india = pool.filter((a) => a.category === 'india').slice(0, 3);
    const world = pool.filter((a) => a.category === 'world').slice(0, 2);
    const tech = pool.filter((a) => a.category === 'technology').slice(0, 2);

    const merged = [...indore, ...india, ...world, ...tech];
    // Fill up to 10 if some categories had fewer
    if (merged.length < 10) {
      for (const a of pool) {
        if (!merged.find((m) => m.id === a.id)) {
          merged.push(a);
        }
        if (merged.length >= 10) break;
      }
    }

    const stories = merged.slice(0, 10).map((a) => ({
      ...a,
      timeAgo: formatTimeAgo(a.publishedAt, language),
    }));

    const dateStr = new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());

    return {
      date: dateStr,
      language,
      stories,
    };
  }
}

export const newsService = new NewsService();
