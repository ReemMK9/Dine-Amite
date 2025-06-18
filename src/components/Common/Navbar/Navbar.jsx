import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/searchresults/${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className={`container-fluid ${styles.navContainer}`}>

        {/* Small screen layout */}
        <div className="d-lg-none w-100">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarMenu"
              aria-controls="navbarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={styles.logoWrapper}>
              <Link to="/" className={styles.title}>Dine'Amite</Link>
            </div>
          </div>

          <div className={`collapse navbar-collapse ${styles.collapsibleMenu}`} id="navbarMenu">
            <div className={`d-flex flex-column align-items-center py-3 ${styles.mobileMenuContent} ${styles.mobileMenuInner}`}>
              <form className={styles.searchMobile} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
              <ul className="navbar-nav text-center mt-3">
                <li className="nav-item">
                  <Link to="/" className={styles.navLink}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/recipes" className={styles.navLink}>Recipes</Link>
                </li>
              </ul>
              <div className={styles.userIconMobile}>
                <Link to="/userprofile">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User Icon"
                    className={styles.userIconImage}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Large screen layout */}
        <div className="d-none d-lg-flex justify-content-between align-items-center w-100">
          <Link to="/" className={styles.title}>Dine'Amite</Link>
          <ul className={`navbar-nav ${styles.menuItems}`}>
            <li className="nav-item">
              <Link to="/" className={styles.navLink}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/recipes" className={styles.navLink}>Recipes</Link>
            </li>
          </ul>
          <form className={styles.search} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className={styles.userIcon}>
            <Link to="/userprofile">
              <img
                src="https://via.placeholder.com/40"
                alt="User Icon"
                className={styles.userIconImage}
              />
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
