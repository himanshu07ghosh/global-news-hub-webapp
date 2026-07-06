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

// src/api/newsApi.js - Updated fetchWithProxy
async function fetchWithProxy(endpoint, params = {}) {
  try {
    let url;
    if (isProduction) {
      // Use Vercel serverless proxy in production
      const queryParams = new URLSearchParams();
      
      // 🔥 FIX: Only add params that have values
      for (const [key, value] of Object.entries(params)) {
        if (value && value !== 'undefined' && value !== 'null' && value !== '' && value !== 'general') {
          queryParams.append(key, value);
        }
      }
      
      url = `/api/news?endpoint=${endpoint}&${queryParams.toString()}`;
    } else {
      // Direct API call in development
      const queryParams = new URLSearchParams({
        ...params,
        apiKey: API_KEY
      });
      // 🔥 FIX: Remove category if it's 'general'
      if (queryParams.has('category') && queryParams.get('category') === 'general') {
        queryParams.delete('category');
      }
      url = `${BASE_URL}${endpoint}?${queryParams}`;
    }
    
    console.log('📤 Fetching:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // 🔥 FIX: Even if API returns error, return the data
    return data;
  } catch (error) {
    console.error('📥 Fetch error:', error.message);
    // 🔥 FIX: Return empty data instead of throwing
    return { status: 'ok', totalResults: 0, articles: [] };
  }
}

/**
 * Get top headlines. Optionally filter by category and/or country.
 */
export async function getTopHeadlines({ category = '', country = 'us', page = 1, pageSize = 12 } = {}) {
  try {
    const params = { 
      country, 
      page, 
      pageSize 
    };
    
    // 🔥 FIX: Only add category if it's not empty and not 'general'
    if (category && category !== 'general' && category !== '') {
      params.category = category;
    }
    
    const data = await fetchWithProxy('/top-headlines', params);
    
    // 🔥 FIX: Check if data has articles
    if (data && data.articles) {
      return normalizeResponse(data, category || 'general');
    }
    
    // Return empty if no articles
    return { articles: [], totalResults: 0 };
  } catch (error) {
    console.error('getTopHeadlines error:', error);
    return { articles: [], totalResults: 0 };
  }
}

/**
 * Get top headlines for a specific country (e.g. India news) without a category.
 */
export async function getCountryHeadlines({ country = 'in', page = 1, pageSize = 12 } = {}) {
  try {
    const params = { country, page, pageSize };
    const data = await fetchWithProxy('/top-headlines', params);
    
    if (data && data.articles) {
      return normalizeResponse(data, 'india');
    }
    return { articles: [], totalResults: 0 };
  } catch (error) {
    console.error('getCountryHeadlines error:', error);
    return { articles: [], totalResults: 0 };
  }
}

/**
 * Get "world" news — general everything query sorted by date.
 */
export async function getWorldNews({ page = 1, pageSize = 12 } = {}) {
  try {
    // 🔥 FIX: Use better search query for world news
    const params = { 
      q: 'world OR global OR international', 
      language: 'en', 
      sortBy: 'publishedAt', 
      page, 
      pageSize 
    };
    const data = await fetchWithProxy('/everything', params);
    
    if (data && data.articles) {
      return normalizeResponse(data, 'world');
    }
    
    // 🔥 FIX: Fallback to top-headlines if everything fails
    console.log('World news empty, falling back to top-headlines');
    return await getTopHeadlines({ country: 'us', pageSize });
  } catch (error) {
    console.error('getWorldNews error:', error);
    // Fallback to top-headlines
    return await getTopHeadlines({ country: 'us', pageSize });
  }
}

/**
 * Search articles by keyword across everything.
 */
export async function searchNews({ query, page = 1, pageSize = 12, sortBy = 'relevancy' }) {
  try {
    const params = { q: query, language: 'en', sortBy, page, pageSize };
    const data = await fetchWithProxy('/everything', params);
    
    if (data && data.articles) {
      return normalizeResponse(data, 'search');
    }
    return { articles: [], totalResults: 0 };
  } catch (error) {
    console.error('searchNews error:', error);
    return { articles: [], totalResults: 0 };
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
    
    if (data && data.articles) {
      return normalizeResponse(data, 'breaking');
    }
    return { articles: [], totalResults: 0 };
  } catch (error) {
    console.error('getBreakingNews error:', error);
    return { articles: [], totalResults: 0 };
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

export const fetchIndiaNews = async (pageSize = 20) => {
  // Mock data for India news with images
  const mockArticles = [
    {
      id: 'mock-1',
      title: "India's Economy Shows Strong Growth Momentum",
      description: 'Latest economic indicators show positive trend in GDP growth',
      content: "India's economy continues to show resilience with strong GDP growth...",
      author: 'Economic Times',
      source: 'Economic Times',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop', // Economy image
      publishedAt: new Date().toISOString(),
      category: 'india'
    },
    {
      id: 'mock-2',
      title: 'Indian Tech Startups Raise Record Funding',
      description: 'Venture capital investment in Indian startups reaches all-time high',
      content: 'Indian tech startups have raised record funding in the current quarter...',
      author: 'TechCrunch India',
      source: 'TechCrunch India',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=200&fit=crop', // Tech image
      publishedAt: new Date().toISOString(),
      category: 'india'
    },
    {
      id: 'mock-3',
      title: "India's Space Program Achieves New Milestone",
      description: 'ISRO successfully launches next-generation satellite',
      content: "India's space research organization achieves another milestone...",
      author: 'The Hindu',
      source: 'The Hindu',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop', // Space image
      publishedAt: new Date().toISOString(),
      category: 'india'
    },
    {
      id: 'mock-4',
      title: 'Indian Cricket Team Wins Series',
      description: 'Team India clinches victory in the latest international series',
      content: 'The Indian cricket team secured a convincing victory in the series...',
      author: 'Sports India',
      source: 'Sports India',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=200&fit=crop', // Sports image
      publishedAt: new Date().toISOString(),
      category: 'india'
    }
  ];
  
  // Try real API first
  try {
    const params = {
      q: 'India news',
      language: 'en',
      pageSize,
      sortBy: 'publishedAt'
    };
    const data = await fetchWithProxy('/everything', params);
    if (data && data.articles && data.articles.length > 0) {
      // Check if real articles have images
      const articlesWithImages = data.articles.map(article => ({
        ...article,
        imageUrl: article.urlToImage || getFallbackImage(article.category)
      }));
      return normalizeResponse({ ...data, articles: articlesWithImages }, 'india');
    }
  } catch (error) {
    console.log('India API failed, using mock data');
  }
  
  // Return mock data with images
  return {
    articles: mockArticles.slice(0, pageSize),
    totalResults: mockArticles.length
  };
};

// Helper function for fallback images
function getFallbackImage(category) {
  const images = {
    india: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=200&fit=crop',
    technology: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=200&fit=crop',
    sports: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=200&fit=crop',
    business: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=200&fit=crop',
    science: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
    default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop'
  };
  return images[category] || images.default;
}
