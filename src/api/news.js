export default async function handler(req, res) {
  const API_KEY = process.env.VITE_NEWS_API_KEY;
  // Proxy request to NewsAPI
  const response = await fetch(`https://newsapi.org/v2/...&apiKey=${API_KEY}`);
  res.json(await response.json());
}
