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
const isProduction = import.meta.env.PROD;

// Create axios instance
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach the API key to every request automatically (only in development)
client.interceptors.request.use((config) => {
  // In production, we use the proxy so we don't need to attach API key here
  if (!isProduction) {
    config.params = { ...config.params, apiKey: API_KEY };
  }
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
 * 🔥 NEW: Helper function to make API calls with proxy support
 */
async function fetchWithProxy(endpoint, params = {}) {
  try {
    let url;
    if (isProduction) {
      // Use Vercel serverless proxy in production
      const queryParams = new URLSearchParams(params).toString();
      url = `/api/news?endpoint=${endpoint}&${queryParams}`;
    } else {
      // Direct API call in development
      const { data } = await client.get(endpoint, { params });
      return data;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get top headlines. Optionally filter by category and/or country.
 */
export async function getTopHeadlines({ category = '', country = 'us', page = 1, pageSize = 12 } = {}) {
  try {
    const params = { country, category: category || undefined, page, pageSize };
    const data = await fetchWithProxy('/top-headlines', params);
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
    const params = { country, page, pageSize };
    const data = await fetchWithProxy('/top-headlines', params);
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
    const params = { q: 'world', language: 'en', sortBy: 'publishedAt', page, pageSize };
    const data = await fetchWithProxy('/everything', params);
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
    const params = { q: query, language: 'en', sortBy, page, pageSize };
    const data = await fetchWithProxy('/everything', params);
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
    const params = { country, pageSize };
    const data = await fetchWithProxy('/top-headlines', params);
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
 * Get India-specific news using search query.
 * Falls back to US top headlines if India search fails.
 */
export const fetchIndiaNews = async (pageSize = 20) => {
  try {
    const params = {
      q: 'India OR Indian OR "Indian news"',
      language: 'en',
      pageSize,
      sortBy: 'publishedAt'
    };
    const data = await fetchWithProxy('/everything', params);
    return normalizeResponse(data, 'india');
  } catch (error) {
    console.error('India news error:', error);
    // Fallback to US headlines if India search fails
    try {
      const params = { country: 'us', pageSize };
      const data = await fetchWithProxy('/top-headlines', params);
      return normalizeResponse(data, 'india');
    } catch (fallbackError) {
      handleError(fallbackError);
    }
  }
};
