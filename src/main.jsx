import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { BookmarkProvider } from './context/BookmarkContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BookmarkProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
