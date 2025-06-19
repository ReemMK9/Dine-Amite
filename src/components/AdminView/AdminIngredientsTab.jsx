// src/components/AdminView/AdminIngredientsTab.jsx

import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaLeaf, FaCarrot } from 'react-icons/fa';
import styles from './AdminDataTable.module.css';

const AdminIngredientsTab = ({ 
  ingredients, 
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
  const filteredIngredients = getFilteredData(ingredients, ['name', 'name_alt']);
  const paginatedIngredients = getPaginatedData(filteredIngredients);
  const totalPages = getTotalPages(filteredIngredients);

  if (loading) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading ingredients...
        </div>
      </div>
    );
  }

  if (filteredIngredients.length === 0 && !searchTerm) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Ingredients Management</h3>
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('ingredient')}
          >
            <FaPlus /> Add Ingredient
          </button>
        </div>
        <div className={styles.emptyState}>
          <FaCarrot className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Ingredients Found</h4>
          <p className={styles.emptyStateText}>
            Add ingredients to build your comprehensive recipe database. Start with common ingredients like vegetables, proteins, and spices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <h3 className={styles.contentTitle}>Ingredients Management</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('ingredient')}
          >
            <FaPlus /> Add Ingredient
          </button>
        </div>
      </div>
      
      {filteredIngredients.length === 0 ? (
        <div className={styles.emptyState}>
          <FaCarrot className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Ingredients Match Your Search</h4>
          <p className={styles.emptyStateText}>
            Try adjusting your search terms or clear the search to see all ingredients.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>ID</th>
                  <th className={styles.tableHeader}>Primary Name</th>
                  <th className={styles.tableHeader}>Alternative Name</th>
                  <th className={styles.tableHeader}>Synced At</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIngredients.map((ingredient) => (
                  <tr key={ingredient.ingredient_id}>
                    <td className={styles.tableCell}>
                      <code className={styles.userId}>#{ingredient.ingredient_id}</code>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaLeaf style={{ color: '#28a745', fontSize: '1.1rem' }} />
                        <strong>{ingredient.name}</strong>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span style={{ color: '#666', fontStyle: 'italic' }}>
                        {ingredient.name_alt || 'No alternative name'}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {ingredient.synced_at ? new Date(ingredient.synced_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionContainer}>
                        <button
                          className={styles.actionButton}
                          onClick={() => setActionMenuOpenId(
                            actionMenuOpenId === ingredient.ingredient_id ? null : ingredient.ingredient_id
                          )}
                          title="More actions"
                        >
                          &#x22EE;
                        </button>
                        {actionMenuOpenId === ingredient.ingredient_id && (
                          <div className={styles.actionMenu}>
                            <button 
                              className={styles.actionMenuItem}
                              onClick={() => {
                                openModal('ingredient', ingredient);
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaEdit /> Edit Ingredient
                            </button>
                            <button 
                              className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
                              onClick={() => {
                                handleDelete('ingredient', ingredient.ingredient_id, 'ingredient_id');
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaTrash /> Delete Ingredient
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredIngredients.length)} of {filteredIngredients.length} ingredients
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

export default AdminIngredientsTab;