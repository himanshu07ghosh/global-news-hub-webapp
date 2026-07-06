import { useEffect, useState } from 'react';

const STORAGE_KEY = 'gnh-recent-searches';
const MAX_ITEMS = 8;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  const clearSearches = () => setRecentSearches([]);

  return { recentSearches, addSearch, clearSearches };
}

export default useRecentSearches;
