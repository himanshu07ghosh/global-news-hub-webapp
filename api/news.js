// api/news.js - Vercel Serverless Function (IMPROVED)
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const API_KEY = process.env.VITE_NEWS_API_KEY;
  const { endpoint, ...params } = req.query;

  if (!API_KEY) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'API key is missing. Please set VITE_NEWS_API_KEY in environment variables.' 
    });
  }

  try {
    const baseUrl = 'https://newsapi.org/v2';
    
    // 🔥 FIX: Clean up params - remove undefined/empty values
    const cleanParams = {};
    for (const [key, value] of Object.entries(params)) {
      if (value && value !== 'undefined' && value !== 'null' && value !== '' && value !== 'general') {
        cleanParams[key] = value;
      }
    }
    
    // 🔥 FIX: Ensure country is always set
    if (!cleanParams.country) {
      cleanParams.country = 'us';
    }
    
    // 🔥 FIX: Remove category if it's 'general' (NewsAPI doesn't need it)
    if (cleanParams.category === 'general') {
      delete cleanParams.category;
    }
    
    const queryParams = new URLSearchParams({
      ...cleanParams,
      apiKey: API_KEY
    });
    
    const url = `${baseUrl}${endpoint}?${queryParams}`;
    console.log('🔵 Proxying to:', url);

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    console.log('🟢 Response status:', response.status);
    console.log('🟢 Articles count:', data.articles?.length || 0);
    
    // 🔥 FIX: Always return 200 with data (even if empty)
    res.status(200).json(data);
  } catch (error) {
    console.error('🔴 Proxy error:', error.message);
    
    // Return empty response instead of error
    res.status(200).json({
      status: 'ok',
      totalResults: 0,
      articles: []
    });
  }
}
