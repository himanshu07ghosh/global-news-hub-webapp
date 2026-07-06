import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx';
import ScrollProgress from './components/ScrollToTop/ScrollProgress.jsx';
import Home from './pages/Home/Home.jsx';
import Category from './pages/Category/Category.jsx';
import Search from './pages/Search/Search.jsx';
import Article from './pages/Article/Article.jsx';
import Bookmarks from './pages/Bookmarks/Bookmarks.jsx';
import About from './pages/About/About.jsx';
import Contact from './pages/Contact/Contact.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <ScrollProgress />
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/search" element={<Search />} />
            <Route path="/article" element={<Article />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
