import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generic hook to fetch news with loading / error / infinite-scroll support.
 *
 * @param {Function} fetcher - async function(page) => { articles, totalResults }
 * @param {Array} deps - dependency array; changing these resets the list & page
 */
export function useFetchNews(fetcher, deps = []) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const totalResultsRef = useRef(0);

  const loadPage = useCallback(
    async (pageToLoad, replace) => {
      try {
        if (replace) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const result = await fetcher(pageToLoad);
        const newArticles = result?.articles || [];
        totalResultsRef.current = result?.totalResults || 0;

        setArticles((prev) => (replace ? newArticles : [...prev, ...newArticles]));
        setHasMore(
          newArticles.length > 0 &&
            (replace ? newArticles.length : articles.length + newArticles.length) < totalResultsRef.current
        );
      } catch (err) {
        setError(err.message || 'Failed to load news.');
        if (replace) setArticles([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher]
  );

  useEffect(() => {
    setPage(1);
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const loadMore = () => {
    if (loadingMore || loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, false);
  };

  const refetch = () => {
    setPage(1);
    loadPage(1, true);
  };

  return { articles, loading, loadingMore, error, hasMore, loadMore, refetch };
}

export default useFetchNews;
