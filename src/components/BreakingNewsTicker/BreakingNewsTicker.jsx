import { useNavigate } from 'react-router-dom';
import './BreakingNewsTicker.css';

function BreakingNewsTicker({ articles = [] }) {
  const navigate = useNavigate();
  if (!articles.length) return null;

  // Duplicate the list so the marquee loops seamlessly.
  const loopArticles = [...articles, ...articles];

  return (
    <div className="ticker">
      <div className="container ticker__inner">
        <span className="ticker__label">Breaking</span>
        <div className="ticker__track-wrap">
          <div className="ticker__track">
            {loopArticles.map((article, i) => (
              <button
                key={`${article.id}-${i}`}
                className="ticker__item"
                onClick={() => navigate('/article', { state: { article } })}
              >
                {article.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreakingNewsTicker;
