import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import NewsCard from '../NewsCard/NewsCard.jsx';
import { NewsGridSkeleton } from '../Loading/Loading.jsx';
import ErrorPage from '../ErrorPage/ErrorPage.jsx';
import './CategorySection.css';

function CategorySection({ title, eyebrow, articles, loading, error, viewAllLink, onRetry, columns = 3 }) {
  return (
    <section className="section category-section">
      <div className="container">
        <div className="section-header">
          <div>
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            <h2 className="section-title">{title}</h2>
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} className="view-all-link">
              View All <FiArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading && <NewsGridSkeleton count={columns} />}
        {!loading && error && <ErrorPage message={error} onRetry={onRetry} />}
        {!loading && !error && articles.length === 0 && (
          <ErrorPage message="No articles found for this section right now." />
        )}
        {!loading && !error && articles.length > 0 && (
          <div className={`category-grid category-grid--cols-${columns}`}>
            {articles.map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CategorySection;
