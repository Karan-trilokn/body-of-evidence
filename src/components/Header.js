import React, { useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { client } from "../config/contentfulClient";

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();


    const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.focusSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [location.state]);

  const handleSearcha = async (e) => {
 
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
          const response = await client.getEntries({
        content_type: "article",
        "fields.articleTitle[match]": searchQuery,  
        limit: 10,
      });

      const items = response.items || [];
      setSearchResults(items);
      console.log("✅ Search Results:", items);

       navigate("/search", { state: { query: searchQuery, results: items } });
 
    } catch (error) {
      console.error("❌ Error fetching search results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;

  // Navigate with query param
  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
};

  return (
    <header className="site-header">
      <div className="header-main nav-area">
        <div className="container">
          <div className="header-inner-main">
            <div className="navbar-container">
              <nav className="navbar navbar-dark navbar-expand-lg">
                <div className="header-logo">
                  <a href="/">
                    <img
                      src="/assets/images/logo.svg"
                      className="img-fluid logo-hs"
                      alt="Logo"
                    />
                    <img
                      src="/assets/images/logo-dark.svg"
                      className="img-fluid logo-dark-hs"
                      alt="Logo Dark"
                    />
                  </a>
                </div>

                <div className="header-inner d-flex">
                  <div className="header-right">
                    <button
                      className="navbar-toggler collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarNavDropdown"
                      aria-controls="navbarNavDropdown"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </button>

                    <div className="d-flex align-items-center justify-content-end">
                      <div className="hsearch-main">
                        <form className="header-search" onSubmit={handleSearch}>
                          <div className="headersearch-item">
                            <input
                              type="search"
                              className="hsearch"
                              placeholder="Search..."
                              ref={inputRef}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSearch(e); // ensure Enter always triggers
                                }
                              }}
                            />
                             {isSearching && (
                              <span className="search-loading">⏳</span>
                            )}
                          </div>
                        </form>
                      </div>

                      <div
                        className="collapse header-menu navbar-collapse"
                        id="navbarNavDropdown"
                      >
                        <div className="header-menu-inner">
                          <div className="header-btn-main">
                            <ul className="navbar-nav">
                              <li className="nav-item">
                                <a href="#">About us</a>
                              </li>
                              <li className="nav-item">
                                <a href="#">Contact us</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="theme-btn-main">
                        <ul className="navbar-nav list-unstyled">
                          <li className="nav-item">
                            <button
                              type="button"
                              className="theme-change"
                              onClick={toggleTheme}
                            >
                              <img
                                src="/assets/images/dark-theme-btn.svg"
                                className="img-fluid dark-theme-hs"
                                alt="Dark Theme"
                              />
                              <img
                                src="/assets/images/light-theme-btn.svg"
                                className="img-fluid light-theme-hs"
                                alt="Light Theme"
                              />
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
