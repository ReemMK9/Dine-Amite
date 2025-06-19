// src/components/AdminView/AdminRecipesTab.jsx

import React from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaUtensils, FaClock, FaUsers } from 'react-icons/fa';
import styles from './AdminDataTable.module.css';

const AdminRecipesTab = ({ 
  recipes, 
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
  const filteredRecipes = getFilteredData(recipes, ['title', 'summary']);
  const paginatedRecipes = getPaginatedData(filteredRecipes);
  const totalPages = getTotalPages(filteredRecipes);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No description';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading recipes...
        </div>
      </div>
    );
  }

  if (filteredRecipes.length === 0 && !searchTerm) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Recipes Management</h3>
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('recipe')}
          >
            <FaPlus /> Add Recipe
          </button>
        </div>
        <div className={styles.emptyState}>
          <FaUtensils className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Recipes Found</h4>
          <p className={styles.emptyStateText}>
            There are no recipes in the system yet. Add your first recipe to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <h3 className={styles.contentTitle}>Recipes Management</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button 
            className={styles.primaryButton}
            onClick={() => openModal('recipe')}
          >
            <FaPlus /> Add Recipe
          </button>
        </div>
      </div>
      
      {filteredRecipes.length === 0 ? (
        <div className={styles.emptyState}>
          <FaUtensils className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Recipes Match Your Search</h4>
          <p className={styles.emptyStateText}>
            Try adjusting your search terms or clear the search to see all recipes.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Image</th>
                  <th className={styles.tableHeader}>Title</th>
                  <th className={styles.tableHeader}>Summary</th>
                  <th className={styles.tableHeader}>Cook Time</th>
                  <th className={styles.tableHeader}>Servings</th>
                  <th className={styles.tableHeader}>Added</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecipes.map((recipe) => (
                  <tr key={recipe.recipe_id}>
                    <td className={styles.tableCell}>
                      <img 
                        src={recipe.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                        alt={recipe.title}
                        className={styles.recipeImage}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </td>
                    <td className={styles.tableCell}>
                      <div>
                        <strong>{recipe.title}</strong>
                        {recipe.preparation_time && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                            <FaClock style={{ marginRight: '0.25rem' }} />
                            Prep: {formatTime(recipe.preparation_time)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.summaryText}>
                        {truncateText(recipe.summary)}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaClock style={{ color: '#666' }} />
                        {formatTime(recipe.cooking_time)}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaUsers style={{ color: '#666' }} />
                        {recipe.servings || 'N/A'}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {recipe.synced_at ? new Date(recipe.synced_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionContainer}>
                        <button
                          className={styles.actionButton}
                          onClick={() => setActionMenuOpenId(
                            actionMenuOpenId === recipe.recipe_id ? null : recipe.recipe_id
                          )}
                          title="More actions"
                        >
                          &#x22EE;
                        </button>
                        {actionMenuOpenId === recipe.recipe_id && (
                          <div className={styles.actionMenu}>
                            <button className={styles.actionMenuItem}>
                              <FaEye /> View Recipe
                            </button>
                            <button 
                              className={styles.actionMenuItem}
                              onClick={() => {
                                openModal('recipe', recipe);
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaEdit /> Edit Recipe
                            </button>
                            <button 
                              className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
                              onClick={() => {
                                handleDelete('recipe', recipe.recipe_id, 'recipe_id');
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaTrash /> Delete Recipe
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecipes.length)} of {filteredRecipes.length} recipes
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

export default AdminRecipesTab;