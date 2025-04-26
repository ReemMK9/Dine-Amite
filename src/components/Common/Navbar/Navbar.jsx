import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <a className={styles.title} href="/">
        Dine'Amite
      </a>
      <div className={styles.menu}>
        <ul className={styles.menuItems}>
          <li>
            <a href="">Home</a>
          </li>
          <li>
            <a href="">Recipes</a>
          </li>
          <li>
            <a href="">Blogs</a>
          </li>
          <li>
            <a href="">Chefs</a>
          </li>
        </ul>
      </div>
      <div className={styles.search}>
        <input type="text" placeholder="Search..." />
      </div>
      <div className={styles.userIcon}>
        <img
          src="https://via.placeholder.com/40"
          alt="User Icon"
          className={styles.userIconImage}
        />
      </div>
    </nav>
  );
};

export default Navbar;
