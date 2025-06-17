import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
      <Link to="/" className={styles.title}>
        Dine'Amite
      </Link>
      <div className={styles.menu}>
        <ul className={styles.menuItems}>
          <li>
            <Link to="/" >Home</Link>
          </li>
          <li>
            <Link to="/recipes" >Recipes</Link>
          </li>
          {/* <li>
            <Link to="">Blogs</Link>
          </li>
          <li>
            <Link to="">Chefs</Link>
          </li> */}
        </ul>
      </div>
      <div className={styles.search}>
        <input type="text" placeholder="Search..." />
      </div>
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
    </nav>
  );
};

export default Navbar;
