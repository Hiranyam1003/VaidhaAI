import type { NewsItem } from '../types';

/**
 * Live government news from the backend (GET /api/news, proxied to FastAPI in dev; see vite.config.ts).
 * The backend caches the feed, so this fetches once per page load and filters locally.
 * Never throws: if the backend is down the feed is simply empty.
 */
let newsRequest: Promise<NewsItem[]> | null = null;

function loadNews(): Promise<NewsItem[]> {
  newsRequest ??= fetch('/api/news')
    .then((res) => (res.ok ? res.json() : []))
    .catch(() => [])
    .then((items: NewsItem[]) => {
      if (items.length === 0) newsRequest = null; // let the next visit retry
      return items;
    });
  return newsRequest;
}

export const NewsService = {
  getNews: async (category?: string, query?: string): Promise<NewsItem[]> => {
    let items = await loadNews();

    if (category && category !== 'All Updates') {
      items = items.filter((item) => item.category === category);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.authority.toLowerCase().includes(q)
      );
    }

    return items;
  },

  getNewsById: async (id: string): Promise<NewsItem | undefined> => {
    return (await loadNews()).find((item) => item.id === id);
  },
};
