// src/components/AdminView/AdminOverview.jsx

import React from 'react';
import { FaUsers, FaUtensils, FaComments, FaList, FaChartBar, FaLeaf, FaShoppingCart, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import styles from './AdminOverview.module.css';

const AdminOverview = ({ stats }) => {
  const statCards = [
    {
      icon: FaUsers,
      number: stats.totalUsers,
      label: 'Total Users',
      color: '#28a745',
      bgColor: '#d4edda',
      trend: '+12%',
      trendUp: true
    },
    {
      icon: FaUtensils,
      number: stats.totalRecipes,
      label: 'Total Recipes',
      color: '#fd7e14',
      bgColor: '#fff3cd',
      trend: '+8%',
      trendUp: true
    },
    {
      icon: FaComments,
      number: stats.totalReviews,
      label: 'Total Reviews',
      color: '#6f42c1',
      bgColor: '#e2d9f3',
      trend: '+15%',
      trendUp: true
    },
    {
      icon: FaList,
      number: stats.totalCategories,
      label: 'Categories',
      color: '#20c997',
      bgColor: '#d1ecf1',
      trend: '+2%',
      trendUp: true
    },
    {
      icon: FaLeaf,
      number: stats.totalIngredients,
      label: 'Ingredients',
      color: '#dc3545',
      bgColor: '#f8d7da',
      trend: '+5%',
      trendUp: true
    },
    {
      icon: FaShoppingCart,
      number: stats.totalGroceryLists,
      label: 'Grocery Lists',
      color: '#0dcaf0',
      bgColor: '#cff4fc',
      trend: '+20%',
      trendUp: true
    }
  ];

  const quickActions = [
    { icon: FaUsers, label: 'Add New User', action: 'user' },
    { icon: FaUtensils, label: 'Add Recipe', action: 'recipe' },
    { icon: FaList, label: 'Add Category', action: 'category' },
    { icon: FaLeaf, label: 'Add Ingredient', action: 'ingredient' }
  ];

  const recentActivity = [
    { type: 'user', message: 'New user registration: john_doe', time: '5 minutes ago', icon: FaUsers },
    { type: 'recipe', message: 'Recipe "Pasta Carbonara" was updated', time: '12 minutes ago', icon: FaUtensils },
    { type: 'review', message: 'New 5-star review added', time: '1 hour ago', icon: FaComments },
    { type: 'system', message: 'Database backup completed', time: '2 hours ago', icon: FaCheck }
  ];

  return (
    <div className={styles.overview}>
      {/* Statistics Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: stat.bgColor }}>
              <stat.icon style={{ color: stat.color }} />
            </div>
            <div className={styles.statInfo}>
              <h3 className={styles.statNumber}>{stat.number.toLocaleString()}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
              <div className={`${styles.statTrend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
                <span>{stat.trend} this month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Quick Actions</h3>
          <p className={styles.contentSubtitle}>Frequently used administrative tasks</p>
        </div>
        <div className={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <button key={index} className={styles.quickActionButton}>
              <action.icon className={styles.quickActionIcon} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>System Health</h3>
          <p className={styles.contentSubtitle}>Current system status and performance</p>
        </div>
        <div className={styles.systemHealth}>
          <div className={styles.healthGrid}>
            <div className={`${styles.healthItem} ${styles.healthGood}`}>
              <FaCheck className={styles.healthIcon} />
              <div className={styles.healthContent}>
                <div className={styles.healthLabel}>Database</div>
                <div className={styles.healthValue}>Connected</div>
                <div className={styles.healthDetail}>Response time: 45ms</div>
              </div>
            </div>
            <div className={`${styles.healthItem} ${styles.healthGood}`}>
              <FaCheck className={styles.healthIcon} />
              <div className={styles.healthContent}>
                <div className={styles.healthLabel}>API Status</div>
                <div className={styles.healthValue}>Healthy</div>
                <div className={styles.healthDetail}>Uptime: 99.9%</div>
              </div>
            </div>
            <div className={`${styles.healthItem} ${styles.healthInfo}`}>
              <FaInfoCircle className={styles.healthIcon} />
              <div className={styles.healthContent}>
                <div className={styles.healthLabel}>Last Backup</div>
                <div className={styles.healthValue}>{new Date().toLocaleDateString()}</div>
                <div className={styles.healthDetail}>Automated daily backup</div>
              </div>
            </div>
            <div className={`${styles.healthItem} ${styles.healthGood}`}>
              <FaCheck className={styles.healthIcon} />
              <div className={styles.healthContent}>
                <div className={styles.healthLabel}>Server Load</div>
                <div className={styles.healthValue}>Normal</div>
                <div className={styles.healthDetail}>CPU: 12%, Memory: 45%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Recent Activity</h3>
          <p className={styles.contentSubtitle}>Latest system events and user actions</p>
        </div>
        <div className={styles.activityList}>
          {recentActivity.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <activity.icon />
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityMessage}>{activity.message}</p>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.activityFooter}>
          <button className={styles.viewAllButton}>View All Activity</button>
        </div>
      </div>

      {/* Analytics Preview */}
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Analytics Overview</h3>
          <p className={styles.contentSubtitle}>Key performance metrics</p>
        </div>
        <div className={styles.analyticsPreview}>
          <div className={styles.analyticsPlaceholder}>
            <FaChartBar className={styles.analyticsIcon} />
            <h4>Analytics Dashboard</h4>
            <p>Detailed charts and graphs showing user engagement, recipe popularity, and system performance would be displayed here.</p>
            <button className={styles.viewAnalyticsButton}>View Full Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;