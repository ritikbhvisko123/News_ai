import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { newsService } from './src/server/newsService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Endpoints
  app.get('/api/news', async (req, res) => {
    try {
      const category = (req.query.category as any) || 'top';
      const language = (req.query.language as any) || 'hi';
      const page = parseInt(req.query.page as string, 10) || 1;
      const search = (req.query.search as string) || '';

      const data = newsService.getArticles(category, language, page, 10, search);
      const weather = await newsService.refreshWeather();

      res.json({
        category,
        language,
        total: data.total,
        page,
        articles: data.articles,
        breakingNews: data.breakingNews,
        weather,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[API] /api/news error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  app.get('/api/digest', async (req, res) => {
    try {
      const language = (req.query.language as any) || 'hi';
      const digest = newsService.getTodayDigest(language);
      res.json(digest);
    } catch (err: any) {
      console.error('[API] /api/digest error:', err);
      res.status(500).json({ error: err.message || 'Digest error' });
    }
  });

  app.get('/api/weather/indore', async (req, res) => {
    try {
      const weather = await newsService.refreshWeather();
      res.json(weather);
    } catch (err: any) {
      console.error('[API] /api/weather error:', err);
      res.status(500).json({ error: err.message || 'Weather error' });
    }
  });

  app.post('/api/refresh', async (req, res) => {
    try {
      await newsService.refreshAllFeeds();
      res.json({ success: true, message: 'Feeds refreshed successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Refresh error' });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Frontend integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for SPA routes in dev
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IndoreNews] Express + Vite server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[IndoreNews] Fatal startup error:', err);
  process.exit(1);
});
