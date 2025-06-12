import React from "react";
import styles from "./AdminDashboard.module.css";
import DashboardTab from "../../components/Admin/DashboardTab";

const AdminDashboard = () => {
  return (
    <div className={styles.adminDashboardBody}>
      <section id={styles.sidebar}>
        <a href="#" className={styles.brand}>
          <span className={styles.text}>Dine'Amite</span>
        </a>
        <ul className={styles.sideMenu}>
          <DashboardTab />
          <DashboardTab />
          <DashboardTab />
          <DashboardTab />
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
