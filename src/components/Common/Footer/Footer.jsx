import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className={styles.container}>
        <div className={styles.info}>
          <a className={styles.title} href="">
            Dine'Amite
          </a>
          <p>Description</p>
        </div>
        <div className={styles.links}>
          <div>
            <h2>Follow Us</h2>
            <ul>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Contact Us</h2>
            <ul>
              <li>
                <a href="#">Email</a>
              </li>
              <li>
                <a href="#">Phone</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p>All rights reserved &copy; 2025</p>
    </footer>
  );
};

export default Footer;
