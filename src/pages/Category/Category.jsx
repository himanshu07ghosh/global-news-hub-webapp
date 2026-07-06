import { useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiChevronRight } from 'react-icons/fi';
import NewsCard from '../../components/NewsCard/NewsCard.jsx';
import { NewsGridSkeleton } from '../../components/Loading/Loading.jsx';
import ErrorPage from '../../components/ErrorPage/ErrorPage.jsx';
import { useFetchNews } from '../../hooks/useFetchNews.js';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.js';
import { getTopHeadlines, getCountryHeadlines, getWorldNews, CATEGORIES } from '../../api/newsApi.js';
import './Category.css';

const LABELS = {
  general: 'Top Stories',
  technology: 'Technology',
  business: 'Business',
  sports: 'Sports',
  entertainment: 'Entertainment',
  health: 'Health',
  science: 'Science',
  india: 'India News',
  world: 'World News',
};

function Category() {
  const { categoryName } = useParams();
  const label = LABELS[categoryName] || 'News';

  const fetcher = useCallback(
    (page) => {
      if (categoryName === 'india') return getCountryHeadlines({ country: 'in', page, pageSize: 12 });
      if (categoryName === 'world') return getWorldNews({ page, pageSize: 12 });
      return getTopHeadlines({ category: categoryName === 'general' ? '' : categoryName, page, pageSize: 12 });
    },
    [categoryName]
  );

  const { articles, loading, loadingMore, error, hasMore, loadMore, refetch } = useFetchNews(fetcher, [categoryName]);
  const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore && !loading });

  const otherCategories = useMemo(
    () => [...CATEGORIES, { key: 'india', label: 'India' }, { key: 'world', label: 'World' }].filter(
      (c) => c.key !== categoryName
    ),
    [categoryName]
  );

  return (
    <motion.div
      className="container category-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>{label} | Global News Hub</title>
        <meta name="description" content={`Latest ${label} headlines from around the world, updated live.`} />
      </Helmet>

      <div className="category-page__breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight size={14} />
        <span>{label}</span>
      </div>

      <h1 className="category-page__title">{label}</h1>

      <div className="category-page__chips">
        {otherCategories.map((c) => (
          <Link key={c.key} to={`/category/${c.key}`} className="category-page__chip">
            {c.label}
          </Link>
        ))}
      </div>

      {loading && <NewsGridSkeleton count={9} />}
      {!loading && error && <ErrorPage message={error} onRetry={refetch} />}
      {!loading && !error && articles.length === 0 && (
        <ErrorPage message="No articles found for this category right now." />
      )}
      {!loading && !error && articles.length > 0 && (
        <>
          <div className="category-grid category-grid--cols-3">
            {articles.map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
          {loadingMore && <NewsGridSkeleton count={3} />}
          <div ref={sentinelRef} className="category-page__sentinel" />
          {!hasMore && <p className="category-page__end">You&apos;ve reached the end. That&apos;s all the news for now.</p>}
        </>
      )}
    </motion.div>
  );
}

export default Category;
