import React from "react";
import styles from "./Layout.module.css";
import Navbar from "../components/Common/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Common/Footer/Footer";

const Layout = () => {
  const location = useLocation();
  const noFooterMargin = location.pathname === "/login";

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
      <Footer noFooterMargin={noFooterMargin} />
    </div>
  );
};

export default Layout;