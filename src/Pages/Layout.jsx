import React from "react";
import styles from "./Layout.module.css";
import Navbar from "../components/Common/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Common/Footer/Footer";

const Layout = () => {
  const location = useLocation();
  // Check if the current path is /login
  const noFooterMargin = location.pathname === "/login";

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
      <Footer noFooterMargin={noFooterMargin} />
    </div>
  );
};

export default Layout;