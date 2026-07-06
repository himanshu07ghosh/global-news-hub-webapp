// api/news.js - Vercel Serverless Function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const API_KEY = process.env.VITE_NEWS_API_KEY;
  const { endpoint, ...params } = req.query;

  if (!API_KEY) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'API key is missing. Please set VITE_NEWS_API_KEY in environment variables.' 
    });
  }

  try {
    // Build the NewsAPI URL
    const baseUrl = 'https://newsapi.org/v2';
    const queryParams = new URLSearchParams({
      ...params,
      apiKey: API_KEY
    });
    const url = `${baseUrl}${endpoint}?${queryParams}`;

    console.log('Proxying request to:', url);

    const response = await fetch(url);
    const data = await response.json();

    // Return the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch news: ' + error.message 
    });
  }
}