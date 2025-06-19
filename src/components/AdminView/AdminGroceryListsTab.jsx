// src/components/AdminView/AdminGroceryListsTab.jsx

import React from 'react';
import { FaEye, FaTrash, FaShoppingCart, FaUser, FaClock, FaCalendarAlt } from 'react-icons/fa';
import styles from './AdminDataTable.module.css';

const AdminGroceryListsTab = ({ 
  groceryLists, 
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
  const filteredLists = getFilteredData(groceryLists, ['app_user.username', 'app_user.display_name']);
  const paginatedLists = getPaginatedData(filteredLists);
  const totalPages = getTotalPages(filteredLists);

  const getTimeDifference = (date) => {
    if (!date) return 'N/A';
    
    const now = new Date();
    const listDate = new Date(date);
    const diffInHours = Math.floor((now - listDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    return listDate.toLocaleDateString();
  };

  const handleViewListItems = async (listId) => {
    // In a real implementation, you would fetch the list items
    // For now, we'll show a placeholder
    alert(`Viewing items for grocery list #${listId}\n\nThis would show all items in the grocery list with their quantities and checked status.`);
  };

  if (loading) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading grocery lists...
        </div>
      </div>
    );
  }

  if (filteredLists.length === 0 && !searchTerm) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Grocery Lists Management</h3>
          <div className={styles.headerActions}>
            <input
              type="text"
              placeholder="Search grocery lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.emptyState}>
          <FaShoppingCart className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Grocery Lists Found</h4>
          <p className={styles.emptyStateText}>
            User-created grocery lists will appear here. Users can create lists from recipes or manually add items for their shopping needs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <h3 className={styles.contentTitle}>Grocery Lists Management</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search grocery lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      {filteredLists.length === 0 ? (
        <div className={styles.emptyState}>
          <FaShoppingCart className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Grocery Lists Match Your Search</h4>
          <p className={styles.emptyStateText}>
            Try adjusting your search terms or clear the search to see all grocery lists.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>List ID</th>
                  <th className={styles.tableHeader}>Owner</th>
                  <th className={styles.tableHeader}>Created</th>
                  <th className={styles.tableHeader}>Last Updated</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLists.map((list) => (
                  <tr key={list.list_id}>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaShoppingCart style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }} />
                        <code className={styles.userId}>#{list.list_id}</code>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaUser style={{ color: '#666', fontSize: '0.9rem' }} />
                        <div>
                          <strong>{list.app_user?.username || 'Unknown User'}</strong>
                          {list.app_user?.display_name && (
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              {list.app_user.display_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaCalendarAlt style={{ color: '#666', fontSize: '0.8rem' }} />
                        <div>
                          <div>{list.created_at ? new Date(list.created_at).toLocaleDateString() : 'N/A'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {getTimeDifference(list.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaClock style={{ color: '#666', fontSize: '0.8rem' }} />
                        <div>
                          <div>{list.updated_at ? new Date(list.updated_at).toLocaleDateString() : 'N/A'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {getTimeDifference(list.updated_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {(() => {
                        const daysSinceUpdate = list.updated_at ? 
                          Math.floor((new Date() - new Date(list.updated_at)) / (1000 * 60 * 60 * 24)) : null;
                        
                        if (daysSinceUpdate === null) {
                          return <span className={`${styles.badge} ${styles.badgeInactive}`}>Unknown</span>;
                        } else if (daysSinceUpdate <= 1) {
                          return <span className={`${styles.badge} ${styles.badgeActive}`}>Active</span>;
                        } else if (daysSinceUpdate <= 7) {
                          return <span className={`${styles.badge} ${styles.badgeInactive}`}>Recent</span>;
                        } else {
                          return <span className={`${styles.badge} ${styles.badgeBanned}`}>Stale</span>;
                        }
                      })()}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionContainer}>
                        <button
                          className={styles.actionButton}
                          onClick={() => setActionMenuOpenId(
                            actionMenuOpenId === list.list_id ? null : list.list_id
                          )}
                          title="More actions"
                        >
                          &#x22EE;
                        </button>
                        {actionMenuOpenId === list.list_id && (
                          <div className={styles.actionMenu}>
                            <button 
                              className={styles.actionMenuItem}
                              onClick={() => {
                                handleViewListItems(list.list_id);
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaEye /> View Items
                            </button>
                            <button 
                              className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
                              onClick={() => {
                                handleDelete('grocery_list', list.list_id, 'list_id');
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaTrash /> Delete List
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLists.length)} of {filteredLists.length} grocery lists
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

export default AdminGroceryListsTab;