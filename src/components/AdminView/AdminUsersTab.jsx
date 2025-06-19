// src/components/AdminView/AdminUsersTab.jsx

import React from 'react';
import { FaPlus, FaEye, FaEdit, FaBan, FaTrash, FaUsers } from 'react-icons/fa';
import styles from './AdminDataTable.module.css';

const AdminUsersTab = ({ 
  users, 
  searchTerm, 
  setSearchTerm, 
  currentPage, 
  setCurrentPage,
  actionMenuOpenId,
  setActionMenuOpenId,
  openModal,
  handleDelete,
  getFilteredData,
  getPaginatedData,
  getTotalPages,
  itemsPerPage,
  loading
}) => {
  const filteredUsers = getFilteredData(users, ['username', 'display_name', 'email']);
  const paginatedUsers = getPaginatedData(filteredUsers);
  const totalPages = getTotalPages(filteredUsers);

  const handleBanUser = async (userId) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      // Implement ban logic here
      console.log('Banning user:', userId);
      // You would typically call your API to ban the user
    }
  };

  const getStatusBadge = (user) => {
    // Determine user status based on available data
    if (user.banned_until && new Date(user.banned_until) > new Date()) {
      return <span className={`${styles.badge} ${styles.badgeBanned}`}>Banned</span>;
    }
    if (user.last_sign_in_at) {
      return <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>;
    }
    return <span className={`${styles.badge} ${styles.badgeInactive}`}>Inactive</span>;
  };

  if (loading) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading users...
        </div>
      </div>
    );
  }

  if (filteredUsers.length === 0 && !searchTerm) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Users Management</h3>
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('user')}
          >
            <FaPlus /> Add User
          </button>
        </div>
        <div className={styles.emptyState}>
          <FaUsers className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Users Found</h4>
          <p className={styles.emptyStateText}>
            There are no users in the system yet. Add your first user to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <h3 className={styles.contentTitle}>Users Management</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('user')}
          >
            <FaPlus /> Add User
          </button>
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className={styles.emptyState}>
          <FaUsers className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Users Match Your Search</h4>
          <p className={styles.emptyStateText}>
            Try adjusting your search terms or clear the search to see all users.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Username</th>
                  <th className={styles.tableHeader}>Display Name</th>
                  <th className={styles.tableHeader}>User ID</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Created</th>
                  <th className={styles.tableHeader}>Last Login</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.user_id || user.id}>
                    <td className={styles.tableCell}>
                      <strong>{user.username || 'N/A'}</strong>
                    </td>
                    <td className={styles.tableCell}>
                      {user.display_name || 'N/A'}
                    </td>
                    <td className={styles.tableCell}>
                      <code className={styles.userId}>
                        {(user.user_id || user.id)?.substring(0, 8)}...
                      </code>
                    </td>
                    <td className={styles.tableCell}>
                      {getStatusBadge(user)}
                    </td>
                    <td className={styles.tableCell}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className={styles.tableCell}>
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionContainer}>
                        <button
                          className={styles.actionButton}
                          onClick={() => setActionMenuOpenId(
                            actionMenuOpenId === (user.user_id || user.id) ? null : (user.user_id || user.id)
                          )}
                          title="More actions"
                        >
                          &#x22EE;
                        </button>
                        {actionMenuOpenId === (user.user_id || user.id) && (
                          <div className={styles.actionMenu}>
                            <button className={styles.actionMenuItem}>
                              <FaEye /> View Details
                            </button>
                            <button 
                              className={styles.actionMenuItem}
                              onClick={() => {
                                openModal('user', user);
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaEdit /> Edit User
                            </button>
                            <button 
                              className={styles.actionMenuItem}
                              onClick={() => {
                                handleBanUser(user.user_id || user.id);
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaBan /> {user.banned_until ? 'Unban' : 'Ban'} User
                            </button>
                            <button 
                              className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
                              onClick={() => {
                                handleDelete('app_user', user.user_id || user.id, 'user_id');
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaTrash /> Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div className={styles.paginationButtons}>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`${styles.paginationButton} ${
                    currentPage === i + 1 ? styles.paginationButtonActive : ''
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsersTab;