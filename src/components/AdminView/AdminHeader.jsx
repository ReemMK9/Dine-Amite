// src/components/AdminView/AdminHeader.jsx

import React from 'react';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import supabase from "../../config/supabaseClient";
import styles from './AdminHeader.module.css';

const AdminHeader = ({ activeTab, user, onBackToSite }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard Overview';
      case 'users': return 'Users Management';
      case 'recipes': return 'Recipes Management';
      case 'categories': return 'Categories Management';
      case 'ingredients': return 'Ingredients Management';
      case 'reviews': return 'Reviews Management';
      case 'grocery-lists': return 'Grocery Lists Management';
      case 'settings': return 'System Settings';
      default: return 'Admin Dashboard';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'overview': return 'Monitor system health and view key metrics';
      case 'users': return 'Manage user accounts and permissions';
      case 'recipes': return 'Add, edit, and organize recipes';
      case 'categories': return 'Organize and manage recipe categories';
      case 'ingredients': return 'Manage ingredients database';
      case 'reviews': return 'Moderate user reviews and ratings';
      case 'grocery-lists': return 'View and manage user grocery lists';
      case 'settings': return 'Configure system settings and preferences';
      default: return 'Administrative control panel';
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error logging out:', error);
          alert('Error logging out. Please try again.');
        } else {
          // Redirect to login or home page
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error during logout:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'Admin';
    
    // Try to get display name from user metadata
    const displayName = user.user_metadata?.display_name || 
                       user.user_metadata?.full_name ||
                       user.email?.split('@')[0];
    
    return displayName || 'Admin';
  };

  const getUserEmail = () => {
    return user?.email || 'admin@example.com';
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <h1 className={styles.headerTitle}>{getTabTitle()}</h1>
          <p className={styles.headerDescription}>{getTabDescription()}</p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <FaUser className={styles.userIcon} />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.welcomeText}>Welcome back,</span>
              <span className={styles.userName}>{getUserDisplayName()}</span>
              <span className={styles.userEmail}>{getUserEmail()}</span>
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.backButton}
              onClick={onBackToSite}
              title="Return to main site"
            >
              <FaHome /> 
              <span className={styles.buttonText}>Back to Site</span>
            </button>
            
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Logout from admin panel"
            >
              <FaSignOutAlt />
              <span className={styles.buttonText}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;