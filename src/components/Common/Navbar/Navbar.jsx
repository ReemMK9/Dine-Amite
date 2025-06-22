import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../../config/supabaseClient";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchError) return;
    const handleClick = () => setSearchError("");
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchError]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchError("");
      navigate(`/searchresults/${encodeURIComponent(search.trim())}`);
      setSearch("");
    } else {
      setSearchError("Please fill out this field.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // setDropdownOpen(false);
    navigate("/");
  };

  const UserMenu = () => (
    <div className={styles.userMenuWrapper} tabIndex={0}>
      <div className={styles.userAccount}>
        <i className="material-symbols-outlined">account_circle</i>
        <p className={styles.account}>My Account</p>
        <i className="material-symbols-outlined">arrow_drop_down</i>
      </div>
      <div className={styles.dropdownMenu}>
        <Link to={`/userprofile/${user.id}`} className={styles.dropdownItem}>
          Profile
        </Link>
        <button className={styles.dropdownItem} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );

  const UserLogin = () => (
    <div className={styles.userLoginWrapper}>
      <div className={styles.userAccount}>
        <i className="material-symbols-outlined">account_circle</i>
      </div>
      <Link to="/login" className={styles.loginLink}>
        Log In
      </Link>
    </div>
  );

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div
        className={`container-fluid justify-content-center ${styles.navContainer}`}
      >
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
              <Link to="/" className={styles.title}>
                Dine'Amite
              </Link>
            </div>
          </div>

          <div
            className={`collapse navbar-collapse ${styles.collapsibleMenu}`}
            id="navbarMenu"
          >
            <div
              className={`d-flex flex-column align-items-center py-3 ${styles.mobileMenuContent} ${styles.mobileMenuInner}`}
            >
              <form className={styles.searchMobile} onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for a recipe, ingredient or diet"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>

              <ul className="navbar-nav text-center mt-3">
                <li className="nav-item">
                  <Link to="/" className={styles.navLink}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/recipes" className={styles.navLink}>
                    Recipes
                  </Link>
                </li>
                {user ? (
                  <>
                    <li className="nav-item">
                      <Link
                        to={`/userprofile/${user.id}`}
                        className={styles.navLink}
                      >
                        My Profile
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button
                        onClick={handleLogout}
                        className={`${styles.navLink} btn btn-link p-0`}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link to="/login" className={styles.navLink}>
                      Log In
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Large screen layout */}
        <div
          className="d-none d-lg-flex justify-content-between align-items-center"
          style={{ width: "80%" }}
        >
          <Link to="/" className={styles.title}>
            Dine'Amite
          </Link>
          <ul className={`navbar-nav ${styles.menuItems}`}>
            <li className="nav-item">
              <Link to="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recipes" className={styles.navLink}>
                Recipes
              </Link>
            </li>
          </ul>
          <div className={styles.searchWrapper}>
            <form className={styles.search} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search for a recipe, ingredient or diet"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (searchError) setSearchError("");
                }}
              />
              <button className={styles.searchBtn}>
                <i className="material-symbols-outlined">search</i>
              </button>
            </form>
            {searchError && (
              <div className={styles.searchError}>{searchError}</div>
            )}
          </div>
          {user ? <UserMenu /> : <UserLogin />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
