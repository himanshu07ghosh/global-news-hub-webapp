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
  getWorldNews,
  fetchIndiaNews,
} from '../../api/newsApi.js';
import './Home.css';

function Home() {
  // Breaking News
  const breakingFetcher = useCallback(() => getBreakingNews({ pageSize: 8 }), []);
  const { articles: breaking, loading: breakingLoading } = useFetchNews(breakingFetcher, []);

  // 🔥 FIXED: Trending Now with fallback
  const trendingFetcher = useCallback(async () => {
    try {
      // Try without category first (default)
      let result = await getTopHeadlines({ pageSize: 6 });
      
      // If no articles, try with US only
      if (!result.articles || result.articles.length === 0) {
        console.log('🔄 Trending: No articles, trying US only...');
        result = await getTopHeadlines({ country: 'us', pageSize: 6 });
      }
      
      // If still no articles, try with a general search
      if (!result.articles || result.articles.length === 0) {
        console.log('🔄 Trending: Still no articles, trying fallback...');
        // Use a search query as last resort
        const searchResult = await getTopHeadlines({ category: 'general', pageSize: 6 });
        if (searchResult.articles && searchResult.articles.length > 0) {
          return searchResult;
        }
        // Return empty with proper structure
        return { articles: [], totalResults: 0 };
      }
      
      return result;
    } catch (error) {
      console.error('❌ Trending fetch error:', error);
      return { articles: [], totalResults: 0 };
    }
  }, []);

  const trending = useFetchNews(trendingFetcher, []);

  // Technology News
  const techFetcher = useCallback(() => getTopHeadlines({ category: 'technology', pageSize: 4 }), []);
  const tech = useFetchNews(techFetcher, []);

  // India News
  const indiaFetcher = useCallback(() => fetchIndiaNews(4), []);
  const india = useFetchNews(indiaFetcher, []);

  // 🔥 FIXED: World News with fallback
  const worldFetcher = useCallback(async () => {
    try {
      // Try getWorldNews first
      let result = await getWorldNews({ pageSize: 4 });
      
      // If no articles, try top-headlines with US
      if (!result.articles || result.articles.length === 0) {
        console.log('🔄 World News: No articles, trying US top headlines...');
        result = await getTopHeadlines({ country: 'us', pageSize: 4 });
      }
      
      // If still no articles, try with a search query
      if (!result.articles || result.articles.length === 0) {
        console.log('🔄 World News: Still no articles, trying search fallback...');
        // Import searchNews if needed
        const { searchNews } = await import('../../api/newsApi.js');
        const searchResult = await searchNews({ query: 'world news', pageSize: 4 });
        if (searchResult.articles && searchResult.articles.length > 0) {
          return searchResult;
        }
        return { articles: [], totalResults: 0 };
      }
      
      return result;
    } catch (error) {
      console.error('❌ World News fetch error:', error);
      // Fallback to US top headlines
      try {
        return await getTopHeadlines({ country: 'us', pageSize: 4 });
      } catch (fallbackError) {
        console.error('❌ World News fallback error:', fallbackError);
        return { articles: [], totalResults: 0 };
      }
    }
  }, []);

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
