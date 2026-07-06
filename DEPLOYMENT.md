# 🚀 Deployment Guide — Global News Hub

This guide walks through pushing the project to GitHub and deploying it on **Vercel** or **Netlify**.

---

## 1. Push to GitHub

### Initialize Git (if not already done)

```bash
cd news-website
git init
git add .
git commit -m "Initial commit: Global News Hub"
```

### Create a new repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name it, e.g., `global-news-hub`
3. Leave it **empty** (no README/.gitignore — you already have them)
4. Click **Create repository**

### Connect and push

```bash
git remote add origin https://github.com/<your-username>/global-news-hub.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `global-news-hub` repository
4. Vercel auto-detects Vite — confirm these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add your environment variable:
   - Go to **Environment Variables**
   - Key: `VITE_NEWS_API_KEY`
   - Value: your NewsAPI.org key
   - (Optional) Key: `VITE_NEWS_API_BASE_URL` if using a different provider
6. Click **Deploy**

Your site will be live at `https://global-news-hub.vercel.app` (or your custom domain).

---

## 3. Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **Add new site → Import an existing project**
3. Select your `global-news-hub` repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Under **Site settings → Environment variables**, add:
   - `VITE_NEWS_API_KEY` = your NewsAPI.org key
6. Click **Deploy site**

---

## 4. Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_NEWS_API_KEY` | ✅ Yes | Your API key from [newsapi.org](https://newsapi.org/register) |
| `VITE_NEWS_API_BASE_URL` | ❌ No | Override if switching providers (defaults to NewsAPI.org) |
| `VITE_WEATHER_API_KEY` | ❌ No | Not required — the weather widget uses the free, keyless Open-Meteo API |

**Important:** Any variable prefixed with `VITE_` is exposed to the client bundle. Never put private/secret keys unrelated to this project in `.env` files that get committed.

---

## 5. A Note on NewsAPI.org's Free Tier

NewsAPI.org's free "Developer" plan is intended for local development and **blocks requests from live/production domains** over HTTPS. This means:

- ✅ It works perfectly during `npm run dev` on `localhost`
- ⚠️ It may return a 426 error ("upgradeRequired") when called directly from your deployed Vercel/Netlify domain

**Workarounds for a live production deployment:**

1. **Upgrade to a paid NewsAPI.org plan**, which removes the localhost restriction.
2. **Swap providers** using the same `src/api/newsApi.js` abstraction layer — providers like **GNews** or **NewsData.io** offer free tiers that work in production.
3. **Add a lightweight serverless proxy** (e.g., a Vercel Serverless Function) that calls NewsAPI.org server-side and forwards the response to your frontend, keeping your API key off the client entirely — recommended for any production news app regardless of provider restrictions.

---

## 6. Post-Deployment Checklist

- [ ] Environment variable(s) added on the hosting platform
- [ ] Site loads and headlines populate on the homepage
- [ ] Dark mode toggle persists across page reloads
- [ ] Search returns results
- [ ] Bookmarks save and persist after refresh
- [ ] 404 page displays for invalid routes
- [ ] Site is responsive on mobile (test with browser dev tools)

---

**Made with ❤️ by Himanshu Ghosh**
