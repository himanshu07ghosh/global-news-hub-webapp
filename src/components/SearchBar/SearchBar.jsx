import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

function SearchBar({ initialValue = '', onSearch, recentSearches = [], onClearRecent }) {
  const [value, setValue] = useState(initialValue);

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  return (
    <div className="search-bar-wrap">
      <form className="search-bar" onSubmit={submit}>
        <FiSearch size={20} className="search-bar__icon" />
        <input
          type="text"
          placeholder="Search for news, topics, people, or places…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button type="button" className="search-bar__clear" onClick={() => setValue('')} aria-label="Clear">
            <FiX size={16} />
          </button>
        )}
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {recentSearches.length > 0 && (
        <div className="search-bar__recent">
          <span>Recent:</span>
          {recentSearches.map((term) => (
            <button
              key={term}
              className="search-bar__chip"
              onClick={() => {
                setValue(term);
                onSearch(term);
              }}
            >
              {term}
            </button>
          ))}
          <button className="search-bar__clear-recent" onClick={onClearRecent}>Clear</button>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
