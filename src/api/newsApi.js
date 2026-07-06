import axios from 'axios';

/**
 * ---------------------------------------------------------------------------
 * NEWS API LAYER
 * ---------------------------------------------------------------------------
 * This file is the ONLY place that talks directly to the news provider.
 * The rest of the app (pages, components, hooks) only ever calls the
 * functions exported from this file, and receives data already normalized
 * into a consistent shape:
 *
 *  {
 *    id, title, description, content, author, source,
 *    url, imageUrl, publishedAt, category
 *  }
 *
 * WHY THIS MATTERS
 * If you ever want to switch from NewsAPI.org to GNews, Mediastack, or
 * NewsData.io, you only need to edit this file. The UI never changes because
 * it only depends on the normalized shape above.
 * ---------------------------------------------------------------------------
 */

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach the API key to every request automatically.
client.interceptors.request.use((config) => {
  config.params = { ...config.params, apiKey: API_KEY };
  return config;
});

/**
 * Normalizes a raw NewsAPI.org article object into our internal shape.
 * If you swap providers, just change this mapping function.
 */
function normalizeArticle(raw, category = 'general') {
  if (!raw) return null;
  const id = raw.url || `${raw.title}-${raw.publishedAt}`;
  return {
    id,
    title: raw.title || 'Untitled Article',
    description: raw.description || '',
    content: raw.content || raw.description || '',
    author: raw.author || raw.source?.name || 'Unknown Author',
    source: raw.source?.name || 'Unknown Source',
    url: raw.url,
    imageUrl: raw.urlToImage || null,
    publishedAt: raw.publishedAt,
    category,
  };
}

function normalizeResponse(data, category) {
  const articles = (data?.articles || [])
    .filter((a) => a && a.title && a.title !== '[Removed]')
    .map((a) => normalizeArticle(a, category));
  return {
    totalResults: data?.totalResults || articles.length,
    articles,
  };
}

function handleError(error) {
  if (error.response) {
    const message = error.response.data?.message || 'Something went wrong fetching the news.';
    throw new Error(message);
  } else if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  } else {
    throw new Error(error.message || 'Unexpected error occurred.');
  }
}

/**
 * Get top headlines. Optionally filter by category and/or country.
 */
export async function getTopHeadlines({ category = '', country = 'us', page = 1, pageSize = 12 } = {}) {
  try {
    const { data } = await client.get('/top-headlines', {
      params: { country, category: category || undefined, page, pageSize },
    });
    return normalizeResponse(data, category || 'general');
  } catch (error) {
    handleError(error);
  }
}

/**
 * Get top headlines for a specific country (e.g. India news) without a category.
 */
export async function getCountryHeadlines({ country = 'in', page = 1, pageSize = 12 } = {}) {
  try {
    const { data } = await client.get('/top-headlines', {
      params: { country, page, pageSize },
    });
    return normalizeResponse(data, 'india');
  } catch (error) {
    handleError(error);
  }
}

/**
 * Get "world" news — general everything query sorted by date, excluding a
 * single-country filter, to approximate broad world coverage.
 */
export async function getWorldNews({ page = 1, pageSize = 12 } = {}) {
  try {
    const { data } = await client.get('/everything', {
      params: { q: 'world', language: 'en', sortBy: 'publishedAt', page, pageSize },
    });
    return normalizeResponse(data, 'world');
  } catch (error) {
    handleError(error);
  }
}

/**
 * Search articles by keyword across everything.
 */
export async function searchNews({ query, page = 1, pageSize = 12, sortBy = 'relevancy' }) {
  try {
    const { data } = await client.get('/everything', {
      params: { q: query, language: 'en', sortBy, page, pageSize },
    });
    return normalizeResponse(data, 'search');
  } catch (error) {
    handleError(error);
  }
}

/**
 * Get trending/breaking news — general top headlines, small page size, used
 * for the hero + breaking news ticker.
 */ 
export async function getBreakingNews({ country = 'us', pageSize = 8 } = {}) {
  try {
    const { data } = await client.get('/top-headlines', {
      params: { country, pageSize },
    });
    return normalizeResponse(data, 'breaking');
  } catch (error) {
    handleError(error);
  }
}

export const CATEGORIES = [
  { key: 'general', label: 'Top Stories' },
  { key: 'technology', label: 'Technology' },
  { key: 'business', label: 'Business' },
  { key: 'sports', label: 'Sports' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'health', label: 'Health' },
  { key: 'science', label: 'Science' },
];

export default {
  getTopHeadlines,
  getCountryHeadlines,
  getWorldNews,
  searchNews,
  getBreakingNews,
  CATEGORIES,
};

/**
 * 🔥 FIXED: Get India-specific news using search query.
 * Falls back to US top headlines if India search fails.
 */
export const fetchIndiaNews = async (pageSize = 20) => {
  try {
    // Use the existing client (not 'api')
    const { data } = await client.get('/everything', {
      params: {
        q: 'India OR Indian OR "Indian news"',
        language: 'en',
        pageSize,
        sortBy: 'publishedAt'
      }
    });
    // Use normalizeResponse (not normalizeArticle directly)
    return normalizeResponse(data, 'india');
  } catch (error) {
    console.error('India news error:', error);
    // Fallback to US headlines if India search fails
    try {
      const { data } = await client.get('/top-headlines', {
        params: {
          country: 'us',
          pageSize
        }
      });
      return normalizeResponse(data, 'india');
    } catch (fallbackError) {
      handleError(fallbackError);
    }
  }
};