import { createContext, useContext, useEffect, useState } from 'react';

const BookmarkContext = createContext(null);
const STORAGE_KEY = 'gnh-bookmarks';

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (id) => bookmarks.some((b) => b.id === id);

  const toggleBookmark = (article) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === article.id)) {
        return prev.filter((b) => b.id !== article.id);
      }
      return [article, ...prev];
    });
  };

  const removeBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const clearBookmarks = () => setBookmarks([]);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, isBookmarked, toggleBookmark, removeBookmark, clearBookmarks }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within a BookmarkProvider');
  return ctx;
}
