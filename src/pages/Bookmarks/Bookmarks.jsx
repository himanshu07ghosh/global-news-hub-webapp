import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiBookmark, FiTrash2 } from 'react-icons/fi';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import NewsCard from '../../components/NewsCard/NewsCard.jsx';
import './Bookmarks.css';

function Bookmarks() {
  const { bookmarks, clearBookmarks } = useBookmarks();

  return (
    <motion.div
      className="container bookmarks-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Bookmarks | Global News Hub</title>
      </Helmet>

      <div className="bookmarks-page__header">
        <div>
          <h1>Your Bookmarks</h1>
          <p>{bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}</p>
        </div>
        {bookmarks.length > 0 && (
          <button className="btn btn-outline" onClick={clearBookmarks}>
            <FiTrash2 size={15} /> Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="bookmarks-page__empty">
          <FiBookmark size={48} />
          <h3>No bookmarks yet</h3>
          <p>Tap the bookmark icon on any article to save it here for later.</p>
          <Link to="/" className="btn btn-primary">Browse News</Link>
        </div>
      ) : (
        <div className="category-grid category-grid--cols-3">
          {bookmarks.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Bookmarks;
