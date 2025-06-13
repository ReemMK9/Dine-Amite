import React from 'react';
import styles from '../../Pages/AdminView/AdminDashboard.module.css';
import { FaHome, FaFileAlt, FaChartBar, FaUniversity, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const items = [
    { icon: <FaHome />, label: 'Dashboard' },
    { icon: <FaFileAlt />, label: 'Articles' },
    { icon: <FaChartBar />, label: 'Reports' },
    { icon: <FaUniversity />, label: 'Institution' },
    { icon: <FaUser />, label: 'Profile' },
    { icon: <FaCog />, label: 'Settings' },
    { icon: <FaSignOutAlt />, label: 'Logout' },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>Admin Panel</div>
      <ul className={styles.sidebarList}>
        {items.map((item, idx) => (
          <li key={idx} className={styles.sidebarItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;