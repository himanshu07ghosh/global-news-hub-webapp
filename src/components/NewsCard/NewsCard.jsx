import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookmark, FiClock, FiExternalLink } from 'react-icons/fi';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import { timeAgo } from '../../utils/formatters.js';
import './NewsCard.css';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-family="Poppins" font-size="16" fill="#94a3b8" text-anchor="middle" dy=".3em">Global News Hub</text></svg>`
  );

function NewsCard({ article, index = 0, variant = 'default' }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const bookmarked = isBookmarked(article.id);

  const openArticle = () => {
    navigate('/article', { state: { article } });
  };

  return (
    <motion.article
      className={`news-card news-card--${variant}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -6 }}
    >
      <div className="news-card__image-wrap" onClick={openArticle} role="button" tabIndex={0}>
        <img
          src={imgError || !article.imageUrl ? PLACEHOLDER_IMG : article.imageUrl}
          alt={article.title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="news-card__image"
        />
        {article.category && article.category !== 'search' && (
          <span className="news-card__badge">{article.category}</span>
        )}
        <button
          className={`news-card__bookmark ${bookmarked ? 'news-card__bookmark--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(article);
          }}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <FiBookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="news-card__body">
        <div className="news-card__meta">
          <span className="news-card__source">{article.source}</span>
          <span className="news-card__dot">•</span>
          <span className="news-card__time"><FiClock size={12} /> {timeAgo(article.publishedAt)}</span>
        </div>

        <h3 className="news-card__title" onClick={openArticle} role="button" tabIndex={0}>
          {article.title}
        </h3>

        {variant !== 'compact' && (
          <p className="news-card__desc">{article.description}</p>
        )}

        <div className="news-card__footer">
          <span className="news-card__author">By {article.author}</span>
          <button className="news-card__read-more" onClick={openArticle}>
            Read More <FiExternalLink size={13} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default NewsCard;
