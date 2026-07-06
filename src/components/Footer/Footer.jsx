import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiTwitter } from 'react-icons/fi';
import { CATEGORIES } from '../../api/newsApi.js';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-mark">GNH</span>
            <span>Global News Hub</span>
          </div>
          <p className="footer__tagline">One Place. Every Story.</p>
          <div className="footer__socials">
            <a href="https://instagram.com/himanshu_ghosh_" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FiFacebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter size={18} />
            </a>
            <a href="mailto:himanshu07ghosh@gmail.com" aria-label="Email">
              <FiMail size={18} />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Categories</h4>
          <ul>
            {CATEGORIES.slice(1).map((cat) => (
              <li key={cat.key}>
                <Link to={`/category/${cat.key}`}>{cat.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/bookmarks">Bookmarks</Link></li>
          </ul>
        </div>

        <div className="footer__col footer__newsletter">
          <h4>Stay Updated</h4>
          <p>Get top stories delivered to your inbox.</p>
          <form
            className="footer__newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.target.reset();
              alert('Thanks for subscribing to Global News Hub!');
            }}
          >
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer__credit">
        <p>
          © {year} Global News Hub. All Rights Reserved.
        </p>
        <p className="footer__made-by">
          Made with <span className="footer__heart">❤️</span> by{' '}
          <a
            href="mailto:himanshu07ghosh@gmail.com"
            className="footer__author"
          >
            Himanshu Ghosh
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
