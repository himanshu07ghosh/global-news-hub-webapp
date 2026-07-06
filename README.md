# 🌍 Global News Hub

**One Place. Every Story.**

A modern, responsive news aggregation website built with React and Vite, pulling live headlines from NewsAPI.org. Designed to look and feel like a real product — clean, minimal, and fast.

---

## Live Links :-

Deployed Live Project : [Live Link 🔗🔗](https://global-news-hub-webapp-himanshughosh.vercel.app/)

---

## ✨ Overview

Global News Hub is a full-featured news reader covering breaking news, top headlines, category browsing (Technology, Business, Sports, Entertainment, Health, Science), India-specific news, world news, and live search — wrapped in a premium, Apple/BBC/The Verge-inspired UI with full dark mode support.

Built as a portfolio / internship-ready project by **Himanshu Ghosh**.

---

## 🚀 Features

- **Home Page** — hero banner, breaking news ticker, trending grid, category previews
- **Breaking News Ticker** — auto-scrolling live headline marquee
- **Category Browsing** — Technology, Business, Sports, Entertainment, Health, Science, India, World
- **Live Search** — search any keyword across global news, with recent search history
- **Infinite Scroll** — categories and search results load more automatically as you scroll
- **Article Detail Page** — full article view with reading time, share menu, and copy-link
- **Bookmarks** — save articles locally and revisit them anytime (persisted via Local Storage)
- **Dark Mode / Light Mode** — theme preference saved across sessions
- **Weather Widget** — live local weather (defaults to Dehradun, Uttarakhand)
- **Live Clock & Date** — real-time clock in the hero section
- **Scroll Progress Bar** & **Scroll-to-Top Button**
- **Loading Skeletons** for a polished loading experience
- **Graceful Error Handling** with retry actions
- **Custom 404 Page**
- **Fully Responsive** — desktop, laptop, tablet, and mobile
- **SEO Ready** — React Helmet meta tags, Open Graph tags, per-page titles
- **Smooth Animations** — Framer Motion page transitions, hover states, and reveals

---

## 🗂️ Folder Structure

```
news-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── newsApi.js          # Single API abstraction layer (swap providers here)
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── HeroSection/
│   │   ├── BreakingNewsTicker/
│   │   ├── NewsCard/
│   │   ├── CategorySection/
│   │   ├── SearchBar/
│   │   ├── Loading/
│   │   ├── ErrorPage/
│   │   ├── ScrollToTop/
│   │   ├── ThemeToggle/
│   │   └── WeatherWidget/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Category/
│   │   ├── Search/
│   │   ├── Article/
│   │   ├── Bookmarks/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── NotFound/
│   ├── hooks/
│   │   ├── useFetchNews.js
│   │   ├── useInfiniteScroll.js
│   │   └── useRecentSearches.js
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   └── BookmarkContext.jsx
│   ├── utils/
│   │   └── formatters.js
│   ├── styles/
│   │   ├── variables.css
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Animation | Framer Motion |
| Icons | React Icons |
| SEO | React Helmet Async |
| Dates | date-fns |
| News Data | NewsAPI.org |
| Weather Data | Open-Meteo (free, no key required) |

---

## 📸 Screenshots

> _Add screenshots here after running the project locally, e.g.:_
> `![Home Page](./screenshots/home.png)`
> `![Article Page](./screenshots/article.png)`
> `![Dark Mode](./screenshots/dark-mode.png)`

---

## ⚙️ Installation & Setup

### 1. Extract and install

```bash
cd news-website
npm install
```

### 2. Configure your API key

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and paste your free API key from [NewsAPI.org](https://newsapi.org/register):

```
VITE_NEWS_API_KEY=your_actual_api_key_here
```

> **Note:** NewsAPI's free tier only allows requests from `localhost` in development. For a production deployment, see `DEPLOYMENT.md` for notes on this limitation and workarounds.

### 3. Run the development server

```bash
npm run dev
```

Visit **http://localhost:5173**.

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## 🔑 API Configuration

All news requests go through a single file: `src/api/newsApi.js`. This keeps the rest of the app provider-agnostic — if you want to switch from NewsAPI.org to **GNews**, **Mediastack**, or **NewsData.io**, you only need to edit the request/response mapping inside that one file. No UI or component code needs to change.

The weather widget uses **Open-Meteo**, a free API that requires no key at all, so weather works immediately with zero configuration.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#2563EB` |
| Secondary | `#0F172A` |
| Background | `#F8FAFC` |
| Font | Poppins (Google Fonts) |

---

## 🧭 Future Improvements

- Server-side rendering / static generation for better SEO
- User accounts with cloud-synced bookmarks
- Push notifications for breaking news
- Multi-language support
- Personalized "For You" feed based on reading history
- PWA support for offline reading

---

## 👤 Author

**Made with ❤️ by Himanshu Ghosh**
B.Tech Computer Science Engineering, Dev Bhoomi Uttarakhand University
📧 himanshu07ghosh@gmail.com

---

## 📄 License

This project is free to use for educational, portfolio, and internship purposes.
