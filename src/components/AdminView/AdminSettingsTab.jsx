// src/components/AdminView/AdminSettingsTab.jsx

import React, { useState } from 'react';
import { FaDownload, FaUpload, FaDatabase, FaUsers, FaCog, FaChartBar, FaSave, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import styles from './AdminSettings.module.css';

const AdminSettingsTab = () => {
  const [settings, setSettings] = useState({
    siteName: 'Dine\'Amite',
    allowRegistration: true,
    moderateReviews: false,
    backupFrequency: 'daily',
    maxFileSize: '5',
    enableNotifications: true,
    enableAnalytics: true,
    maintenanceMode: false,
    autoBackup: true
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, save to database
      console.log('Saving settings:', settings);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
    
    setLoading(false);
  };

  const handleExportData = async (type) => {
    setLoading(true);
    try {
      console.log(`Exporting ${type} data...`);
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${type} data exported successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert(`Error exporting ${type} data. Please try again.`);
    }
    setLoading(false);
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      console.log('Creating backup...');
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('Database backup created successfully!');
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Error creating backup. Please try again.');
    }
    setLoading(false);
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      console.log('Syncing recipes...');
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Recipes synced successfully!');
    } catch (error) {
      console.error('Error syncing recipes:', error);
      alert('Error syncing recipes. Please try again.');
    }
    setLoading(false);
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear the system cache? This may temporarily slow down the application.')) {
      setLoading(true);
      try {
        console.log('Clearing cache...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('Cache cleared successfully!');
      } catch (error) {
        console.error('Error clearing cache:', error);
        alert('Error clearing cache. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      {/* System Information */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsHeader}>
          <h3 className={styles.settingsTitle}>System Information</h3>
          <FaChartBar className={styles.settingsIcon} />
        </div>
        <div className={styles.settingsContent}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Application Version:</span>
              <span className={styles.infoValue}>v1.0.0</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Database Status:</span>
              <span className={`${styles.infoValue} ${styles.statusConnected}`}>
                <FaCheck style={{ marginRight: '0.5rem' }} />
                Connected
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Last Backup:</span>
              <span className={styles.infoValue}>{new Date().toLocaleDateString()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>System Uptime:</span>
              <span className={styles.infoValue}>99.9%</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Storage Used:</span>
              <span className={styles.infoValue}>2.3 GB</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Active Sessions:</span>
              <span className={styles.infoValue}>127</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Management */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsHeader}>
          <h3 className={styles.settingsTitle}>Database Management</h3>
          <FaDatabase className={styles.settingsIcon} />
        </div>
        <div className={styles.settingsContent}>
          <p className={styles.sectionDescription}>
            Manage your database, create backups, and export data for analysis or migration purposes.
          </p>
          <div className={styles.actionButtons}>
            <button 
              className={styles.primaryButton}
              onClick={handleBackup}
              disabled={loading}
            >
              <FaDatabase /> {loading ? 'Creating...' : 'Create Backup'}
            </button>
            <button 
              className={styles.primaryButton}
              onClick={handleSync}
              disabled={loading}
            >
              <FaUpload /> {loading ? 'Syncing...' : 'Sync Recipes'}
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={handleClearCache}
              disabled={loading}
            >
              <FaCog /> Clear Cache
            </button>
          </div>
          
          <div className={styles.exportSection}>
            <h4 className={styles.subsectionTitle}>Data Export</h4>
            <div className={styles.actionButtons}>
              <button 
                className={styles.secondaryButton}
                onClick={() => handleExportData('users')}
                disabled={loading}
              >
                <FaDownload /> Export Users
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => handleExportData('recipes')}
                disabled={loading}
              >
                <FaDownload /> Export Recipes
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => handleExportData('reviews')}
                disabled={loading}
              >
                <FaDownload /> Export Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsHeader}>
          <h3 className={styles.settingsTitle}>Site Configuration</h3>
          <FaCog className={styles.settingsIcon} />
        </div>
        <div className={styles.settingsContent}>
          <div className={styles.settingsForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className={styles.formInput}
                  placeholder="Enter site name"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                  className={styles.formInput}
                  min="1"
                  max="100"
                  placeholder="5"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Backup Frequency</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className={styles.formSelect}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div className={styles.checkboxSection}>
              <h4 className={styles.subsectionTitle}>System Options</h4>
              
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>Allow User Registration</span>
                    <span className={styles.checkboxDescription}>
                      Enable new users to create accounts on the platform
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.moderateReviews}
                    onChange={(e) => handleSettingChange('moderateReviews', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>Moderate Reviews</span>
                    <span className={styles.checkboxDescription}>
                      Require admin approval before reviews are published
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>Email Notifications</span>
                    <span className={styles.checkboxDescription}>
                      Send email notifications for important events
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.enableAnalytics}
                    onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>Analytics Tracking</span>
                    <span className={styles.checkboxDescription}>
                      Enable usage analytics and performance monitoring
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>Automatic Backups</span>
                    <span className={styles.checkboxDescription}>
                      Automatically create database backups based on schedule
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>Maintenance Mode</span>
                    <span className={styles.checkboxDescription}>
                      <FaExclamationTriangle style={{ color: '#ffc107', marginRight: '0.25rem' }} />
                      Temporarily disable site access for maintenance
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                className={`${styles.saveButton} ${saveStatus === 'success' ? styles.saveSuccess : saveStatus === 'error' ? styles.saveError : ''}`}
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Saving...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <FaCheck /> Saved!
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <FaExclamationTriangle /> Error
                  </>
                ) : (
                  <>
                    <FaSave /> Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Stats */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsHeader}>
          <h3 className={styles.settingsTitle}>User Management Overview</h3>
          <FaUsers className={styles.settingsIcon} />
        </div>
        <div className={styles.settingsContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                <FaUsers />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>1,234</span>
                <span className={styles.statLabel}>Active Users</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: '#d1ecf1', color: '#0c5460' }}>
                <FaUsers />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>89</span>
                <span className={styles.statLabel}>New This Month</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                <FaUsers />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>Banned Users</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                <FaUsers />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>156</span>
                <span className={styles.statLabel}>Inactive Users</span>
              </div>
            </div>
          </div>
          
          <div className={styles.actionButtons} style={{ marginTop: '1.5rem' }}>
            <button className={styles.primaryButton} disabled={loading}>
              <FaUsers /> Bulk User Operations
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={() => handleExportData('user_analytics')}
              disabled={loading}
            >
              <FaDownload /> Export User Analytics
            </button>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsHeader}>
          <h3 className={styles.settingsTitle}>System Alerts</h3>
          <FaInfoCircle className={styles.settingsIcon} />
        </div>
        <div className={styles.settingsContent}>
          <div className={styles.alertsList}>
            <div className={styles.alertItem} style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb' }}>
              <FaCheck style={{ color: '#155724' }} />
              <div className={styles.alertContent}>
                <strong>System Status: Healthy</strong>
                <p>All systems are operating normally with no reported issues.</p>
              </div>
            </div>
            
            <div className={styles.alertItem} style={{ backgroundColor: '#d1ecf1', borderColor: '#bee5eb' }}>
              <FaInfoCircle style={{ color: '#0c5460' }} />
              <div className={styles.alertContent}>
                <strong>Scheduled Maintenance</strong>
                <p>Next scheduled maintenance window: Sunday, 2:00 AM - 4:00 AM EST</p>
              </div>
            </div>
            
            {settings.maintenanceMode && (
              <div className={styles.alertItem} style={{ backgroundColor: '#fff3cd', borderColor: '#ffeaa7' }}>
                <FaExclamationTriangle style={{ color: '#856404' }} />
                <div className={styles.alertContent}>
                  <strong>Maintenance Mode Active</strong>
                  <p>The site is currently in maintenance mode. Users cannot access the application.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsTab;