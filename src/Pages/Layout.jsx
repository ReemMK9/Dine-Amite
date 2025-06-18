import React from "react";
import styles from "./Layout.module.css";
import Navbar from "../components/Common/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Common/Footer/Footer";

const Layout = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainContent}>
        <Outlet></Outlet>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
