import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FiArrowLeft,
  FiBookmark,
  FiClock,
  FiShare2,
  FiLink,
  FiExternalLink,
  FiTwitter,
  FiFacebook,
} from 'react-icons/fi';
import { useBookmarks } from '../../context/BookmarkContext.jsx';
import { formatDate, timeAgo, estimateReadingTime } from '../../utils/formatters.js';
import ErrorPage from '../../components/ErrorPage/ErrorPage.jsx';
import './Article.css';

function Article() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article = state?.article;
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="container">
        <ErrorPage
          message="We couldn't find that article. It may have been opened from an old link."
          onRetry={() => navigate('/')}
        />
      </div>
    );
  }

  const bookmarked = isBookmarked(article.id);
  const readingTime = estimateReadingTime(article.content || article.description);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(article.url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(article.url || window.location.href);

  return (
    <motion.div
      className="article-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>{article.title} | Global News Hub</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        {article.imageUrl && <meta property="og:image" content={article.imageUrl} />}
      </Helmet>

      <div className="container article-page__inner">
        <button className="article-page__back" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="article-page__meta-top">
          <span className="article-page__category">{article.category}</span>
          <span className="article-page__source">{article.source}</span>
        </div>

        <h1 className="article-page__title">{article.title}</h1>

        <div className="article-page__byline">
          <div className="article-page__byline-info">
            <span>By {article.author}</span>
            <span className="article-page__dot">•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="article-page__dot">•</span>
            <span className="article-page__reading-time"><FiClock size={13} /> {readingTime}</span>
            <span className="article-page__dot">•</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>

          <div className="article-page__actions">
            <button
              className={`article-page__icon-btn ${bookmarked ? 'article-page__icon-btn--active' : ''}`}
              onClick={() => toggleBookmark(article)}
              aria-label="Bookmark"
            >
              <FiBookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <div className="article-page__share-wrap">
              <button
                className="article-page__icon-btn"
                onClick={() => setShareOpen((s) => !s)}
                aria-label="Share"
              >
                <FiShare2 size={17} />
              </button>
              {shareOpen && (
                <div className="article-page__share-menu">
                  <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                    <FiTwitter size={15} /> Twitter
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                    <FiFacebook size={15} /> Facebook
                  </a>
                  <button onClick={handleCopyLink}>
                    <FiLink size={15} /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {article.imageUrl && (
          <div className="article-page__image-wrap">
            <img src={article.imageUrl} alt={article.title} />
          </div>
        )}

        <div className="article-page__body">
          <p className="article-page__lead">{article.description}</p>
          <p>{article.content}</p>
        </div>

        <div className="article-page__cta">
          <p>This is a summary from {article.source}. Read the complete story on the original publisher&apos;s site.</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Visit Original Article <FiExternalLink size={15} />
          </a>
        </div>

        <div className="article-page__footer-links">
          <Link to="/">Back to Home</Link>
          <Link to={`/category/${article.category === 'search' ? 'general' : article.category}`}>
            More {article.category !== 'search' ? article.category : ''} News
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Article;
