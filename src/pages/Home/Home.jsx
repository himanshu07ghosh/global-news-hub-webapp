import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../../components/HeroSection/HeroSection.jsx';
import BreakingNewsTicker from '../../components/BreakingNewsTicker/BreakingNewsTicker.jsx';
import CategorySection from '../../components/CategorySection/CategorySection.jsx';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget.jsx';
import { useFetchNews } from '../../hooks/useFetchNews.js';
import {
  getBreakingNews,
  getTopHeadlines,
  fetchIndiaNews, // Add this import
} from '../../api/newsApi.js';
import './Home.css';

function Home() {
  const breakingFetcher = useCallback(() => getBreakingNews({ pageSize: 8 }), []);
  const { articles: breaking, loading: breakingLoading } = useFetchNews(breakingFetcher, []);

  const trendingFetcher = useCallback(() => getTopHeadlines({ pageSize: 6 }), []);
  const trending = useFetchNews(trendingFetcher, []);

  const techFetcher = useCallback(() => getTopHeadlines({ category: 'technology', pageSize: 4 }), []);
  const tech = useFetchNews(techFetcher, []);

  // 🔥 UPDATED: Using the new fetchIndiaNews function
  const indiaFetcher = useCallback(() => fetchIndiaNews(4), []);
  const india = useFetchNews(indiaFetcher, []);

  const worldFetcher = useCallback(() => getTopHeadlines({ country: 'us', pageSize: 4 }), []);
  const world = useFetchNews(worldFetcher, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Global News Hub | One Place. Every Story.</title>
        <meta
          name="description"
          content="Breaking news, top headlines, and trending stories from India and around the world — updated live."
        />
      </Helmet>

      <BreakingNewsTicker articles={breaking} />
      <HeroSection featured={breaking} loading={breakingLoading} />

      <div className="container home__weather-row">
        <WeatherWidget />
      </div>

      <CategorySection
        title="Trending Now"
        eyebrow="Most Read"
        articles={trending.articles}
        loading={trending.loading}
        error={trending.error}
        onRetry={trending.refetch}
        viewAllLink="/category/general"
        columns={3}
      />

      <div className="home__alt-bg">
        <CategorySection
          title="Technology"
          eyebrow="Innovation"
          articles={tech.articles}
          loading={tech.loading}
          error={tech.error}
          onRetry={tech.refetch}
          viewAllLink="/category/technology"
          columns={4}
        />
      </div>

      {/* 🔥 UPDATED: India News section using fetchIndiaNews */}
      <CategorySection
        title="India News"
        eyebrow="From Home"
        articles={india.articles}
        loading={india.loading}
        error={india.error}
        onRetry={india.refetch}
        viewAllLink="/category/india"
        columns={4}
      />

      <div className="home__alt-bg">
        <CategorySection
          title="World News"
          eyebrow="Global"
          articles={world.articles}
          loading={world.loading}
          error={world.error}
          onRetry={world.refetch}
          viewAllLink="/category/world"
          columns={4}
        />
      </div>
    </motion.div>
  );
}

export default Home;