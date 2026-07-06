import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { getTodayFormatted, timeAgo } from '../../utils/formatters.js';
import { NewsCardSkeleton } from '../Loading/Loading.jsx';
import './HeroSection.css';

function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function HeroSection({ featured, loading }) {
  const navigate = useNavigate();
  const time = useLiveClock();
  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const main = featured?.[0];
  const side = featured?.slice(1, 3) || [];

  const openArticle = (article) => navigate('/article', { state: { article } });

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__intro">
          <div>
            <span className="section-eyebrow">
              <span className="hero__live-dot" /> Live Coverage
            </span>
            <h1 className="hero__headline">One Place. Every Story.</h1>
            <p className="hero__subtext">
              Real-time headlines from trusted sources worldwide — curated for Dehradun and beyond.
            </p>
          </div>
          <div className="hero__clock">
            <span className="hero__clock-time">{timeString}</span>
            <span className="hero__clock-date">{getTodayFormatted()}</span>
          </div>
        </div>

        {loading ? (
          <div className="hero__grid">
            <div className="hero__main"><NewsCardSkeleton /></div>
            <div className="hero__side">
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </div>
          </div>
        ) : (
          main && (
            <div className="hero__grid">
              <motion.div
                className="hero__main"
                onClick={() => openArticle(main)}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img src={main.imageUrl || undefined} alt={main.title} className="hero__main-img" />
                <div className="hero__main-overlay">
                  <span className="hero__main-badge">{main.source}</span>
                  <h2>{main.title}</h2>
                  <div className="hero__main-meta">
                    <span>{timeAgo(main.publishedAt)}</span>
                    <span className="hero__main-cta">
                      Read Story <FiArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="hero__side">
                {side.map((article, i) => (
                  <motion.div
                    key={article.id}
                    className="hero__side-item"
                    onClick={() => openArticle(article)}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  >
                    <img src={article.imageUrl || undefined} alt={article.title} />
                    <div className="hero__side-content">
                      <span className="hero__side-source">{article.source}</span>
                      <h4>{article.title}</h4>
                      <span className="hero__side-time">{timeAgo(article.publishedAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default HeroSection;
