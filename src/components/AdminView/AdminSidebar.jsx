// src/components/AdminView/AdminSidebar.jsx

import React from 'react';
import { FaUsers, FaUtensils, FaList, FaComments, FaChartBar, FaCog, FaLeaf } from 'react-icons/fa';
import styles from './AdminSidebar.module.css';

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'recipes', label: 'Recipes', icon: FaUtensils },
    { id: 'categories', label: 'Categories', icon: FaList },
    { id: 'ingredients', label: 'Ingredients', icon: FaLeaf },
    { id: 'reviews', label: 'Reviews', icon: FaComments },
    { id: 'grocery-lists', label: 'Grocery Lists', icon: FaList },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Dine'Amite Admin</h2>
      <nav className={styles.navigation}>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
            onClick={() => onTabChange(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onTabChange(item.id)}
          >
            <item.icon className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </div>
        ))}
      </nav>
      
      <div className={styles.sidebarFooter}>
        <div className={styles.footerText}>
          <p>Admin Panel v1.0</p>
          <p>© 2025 Dine'Amite</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;