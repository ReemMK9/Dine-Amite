import React from "react";
import styles from "./Footer.module.css";

const Footer = ({ noFooterMargin }) => {
  return (
    <footer className={noFooterMargin ? styles.noFooterMargin : ""}>
      <div className={`container-fluid ${styles.footerOuter}`}>
        <div className={`row ${styles.footerRow}`}>
          <div className="col-md-4 col-12 mb-4 mb-md-0 d-flex align-items-center justify-content-center">
            <a className={styles.title} href="">
              Dine'Amite
            </a>
            {/* <p>Description</p> */}
          </div>
          <div className="col-md-4 col-12 mb-4 mb-md-0">
            <h2 className={styles.footerText}>Follow Us</h2>
            <ul className={styles.socialinksList}>
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-facebook-f ${styles.socialLogos}`}></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-x-twitter ${styles.socialLogos}`}></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-instagram ${styles.socialLogos}`}></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 col-12 mb-4 mb-md-0">
            <h2 className={styles.footerText}>Contact Us</h2>
            <ul>
              <li>
                <a href="mailto:info@dineamite.com?subject=Hello&body=I%20have%20a%20question">
                  info@dineamite.com
                </a>
              </li>
              <li>
                <a href="tel:+201234567890">01234567890</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center">All rights reserved &copy; 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
