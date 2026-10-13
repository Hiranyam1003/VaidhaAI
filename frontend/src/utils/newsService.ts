import { MOCK_NEWS_DATA } from '../data/mockData';
import { localizeNews } from '../i18n/content';
import type { Language, NewsItem } from '../types';

/**
 * Service separating news data retrieval from UI components.
 * Structured so a future backend API (e.g. GET /api/news) can seamlessly replace
 * this local mock store without altering UI components.
 */
export const NewsService = {
  getNews: async (category?: string, query?: string, language: Language = 'English'): Promise<NewsItem[]> => {
    // Simulated micro-delay representing local cache lookup
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Translate first so searching works in the selected language.
    let items = localizeNews(MOCK_NEWS_DATA, language);

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
    return MOCK_NEWS_DATA.find((item) => item.id === id);
  },
};
