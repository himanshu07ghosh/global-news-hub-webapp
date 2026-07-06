import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiSearch } from 'react-icons/fi';
import './NotFound.css';

function NotFound() {
  return (
    <motion.div
      className="container not-found"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>Page Not Found | Global News Hub</title>
      </Helmet>

      <motion.div
        className="not-found__code"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        404
      </motion.div>
      <h1>This story doesn&apos;t exist.</h1>
      <p>The page you&apos;re looking for may have been moved, archived, or never published.</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn-primary">
          <FiHome size={16} /> Back to Home
        </Link>
        <Link to="/search" className="btn btn-outline">
          <FiSearch size={16} /> Search News
        </Link>
      </div>
    </motion.div>
  );
}

export default NotFound;
