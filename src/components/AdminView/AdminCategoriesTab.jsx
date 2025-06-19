// src/components/AdminView/AdminCategoriesTab.jsx

import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaList, FaTags } from 'react-icons/fa';
import styles from './AdminDataTable.module.css';

const AdminCategoriesTab = ({ 
  categories, 
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
  const filteredCategories = getFilteredData(categories, ['name']);
  const paginatedCategories = getPaginatedData(filteredCategories);
  const totalPages = getTotalPages(filteredCategories);

  if (loading) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading categories...
        </div>
      </div>
    );
  }

  if (filteredCategories.length === 0 && !searchTerm) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Categories Management</h3>
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('category')}
          >
            <FaPlus /> Add Category
          </button>
        </div>
        <div className={styles.emptyState}>
          <FaTags className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Categories Found</h4>
          <p className={styles.emptyStateText}>
            Create your first category to organize recipes by type, cuisine, or dietary preference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <h3 className={styles.contentTitle}>Categories Management</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('category')}
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>
      
      {filteredCategories.length === 0 ? (
        <div className={styles.emptyState}>
          <FaTags className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Categories Match Your Search</h4>
          <p className={styles.emptyStateText}>
            Try adjusting your search terms or clear the search to see all categories.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>ID</th>
                  <th className={styles.tableHeader}>Category Name</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category) => (
                  <tr key={category.category_id}>
                    <td className={styles.tableCell}>
                      <code className={styles.userId}>#{category.category_id}</code>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaTags style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }} />
                        <strong>{category.name}</strong>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionContainer}>
                        <button
                          className={styles.actionButton}
                          onClick={() => setActionMenuOpenId(
                            actionMenuOpenId === category.category_id ? null : category.category_id
                          )}
                          title="More actions"
                        >
                          &#x22EE;
                        </button>
                        {actionMenuOpenId === category.category_id && (
                          <div className={styles.actionMenu}>
                            <button 
                              className={styles.actionMenuItem}
                              onClick={() => {
                                openModal('category', category);
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaEdit /> Edit Category
                            </button>
                            <button 
                              className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
                              onClick={() => {
                                handleDelete('category', category.category_id, 'category_id');
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaTrash /> Delete Category
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
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

export default AdminCategoriesTab;