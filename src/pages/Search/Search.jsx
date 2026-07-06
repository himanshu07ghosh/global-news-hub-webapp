import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import NewsCard from '../../components/NewsCard/NewsCard.jsx';
import { NewsGridSkeleton } from '../../components/Loading/Loading.jsx';
import ErrorPage from '../../components/ErrorPage/ErrorPage.jsx';
import { useFetchNews } from '../../hooks/useFetchNews.js';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.js';
import { useRecentSearches } from '../../hooks/useRecentSearches.js';
import { searchNews } from '../../api/newsApi.js';
import './Search.css';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();

  const fetcher = useCallback(
    (page) => {
      if (!query) return Promise.resolve({ articles: [], totalResults: 0 });
      return searchNews({ query, page, pageSize: 12, sortBy: 'publishedAt' });
    },
    [query]
  );

  const { articles, loading, loadingMore, error, hasMore, loadMore, refetch } = useFetchNews(fetcher, [query]);
  const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore && !loading && !!query });

  useEffect(() => {
    if (query) addSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = (term) => {
    setSearchParams({ q: term });
  };

  return (
    <motion.div
      className="container search-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>{query ? `"${query}" — Search Results` : 'Search'} | Global News Hub</title>
      </Helmet>

      <h1 className="search-page__title">Search</h1>
      <SearchBar
        initialValue={query}
        onSearch={handleSearch}
        recentSearches={recentSearches}
        onClearRecent={clearSearches}
      />

      {!query && (
        <p className="search-page__hint">
          Try searching for a topic, person, company, or place — e.g. &ldquo;climate change&rdquo;,
          &ldquo;cricket&rdquo;, &ldquo;elections&rdquo;.
        </p>
      )}

      {query && loading && <NewsGridSkeleton count={9} />}
      {query && !loading && error && <ErrorPage message={error} onRetry={refetch} />}
      {query && !loading && !error && articles.length === 0 && (
        <ErrorPage message={`No Articles Found for "${query}". Try a different keyword.`} />
      )}
      {query && !loading && !error && articles.length > 0 && (
        <>
          <p className="search-page__count">Showing results for <strong>&ldquo;{query}&rdquo;</strong></p>
          <div className="category-grid category-grid--cols-3">
            {articles.map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
          {loadingMore && <NewsGridSkeleton count={3} />}
          <div ref={sentinelRef} className="category-page__sentinel" />
        </>
      )}
    </motion.div>
  );
}

export default Search;
