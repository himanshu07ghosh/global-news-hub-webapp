import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import './ErrorPage.css';

function ErrorPage({ message = 'Something went wrong while fetching the news.', onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <FiAlertCircle size={40} />
      </div>
      <h3>We hit a snag</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          <FiRefreshCw size={16} /> Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorPage;
