import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSearch, FiBookmark } from 'react-icons/fi';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/category/technology', label: 'Technology' },
  { to: '/category/business', label: 'Business' },
  { to: '/category/sports', label: 'Sports' },
  { to: '/category/entertainment', label: 'Entertainment' },
  { to: '/category/health', label: 'Health' },
  { to: '/category/science', label: 'Science' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className={`navbar glass ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-mark">GNH</span>
          <span className="navbar__logo-text">Global News Hub</span>
        </Link>

        <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/bookmarks" className="navbar__link navbar__link--mobile-only" onClick={() => setMenuOpen(false)}>
            Bookmarks
          </NavLink>
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__icon-btn"
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
          >
            <FiSearch size={19} />
          </button>
          <Link to="/bookmarks" className="navbar__icon-btn navbar__bookmark-link" aria-label="Bookmarks">
            <FiBookmark size={19} />
          </Link>
          <ThemeToggle />
          <button
            className="navbar__icon-btn navbar__menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((m) => !m)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="navbar__search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <form className="container navbar__search-form" onSubmit={handleSearchSubmit}>
              <FiSearch size={18} />
              <input
                autoFocus
                type="text"
                placeholder="Search live news… e.g. 'AI', 'Cricket World Cup', 'Elections'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
