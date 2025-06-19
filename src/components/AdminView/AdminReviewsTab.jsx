// src/components/AdminView/AdminReviewsTab.jsx

import React from 'react';
import { FaEye, FaTrash, FaComments, FaStar, FaUser, FaUtensils } from 'react-icons/fa';
import styles from './AdminDataTable.module.css';

const AdminReviewsTab = ({ 
  reviews, 
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
  const filteredReviews = getFilteredData(reviews, ['comment', 'recipe.title', 'app_user.username']);
  const paginatedReviews = getPaginatedData(filteredReviews);
  const totalPages = getTotalPages(filteredReviews);

  const renderStars = (rating) => {
    return (
      <div className={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? styles.starFilled : styles.starEmpty}
          />
        ))}
        <span className={styles.ratingText}>({rating}/5)</span>
      </div>
    );
  };

  const truncateComment = (comment, maxLength = 60) => {
    if (!comment) return 'No comment provided';
    return comment.length > maxLength ? comment.substring(0, maxLength) + '...' : comment;
  };

  const handleViewFullReview = (review) => {
    alert(`Full Review:\n\nRecipe: ${review.recipe?.title || 'Unknown'}\nUser: ${review.app_user?.username || 'Unknown'}\nRating: ${review.rating}/5\nComment: ${review.comment || 'No comment'}\nDate: ${new Date(review.created_at).toLocaleString()}`);
  };

  if (loading) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading reviews...
        </div>
      </div>
    );
  }

  if (filteredReviews.length === 0 && !searchTerm) {
    return (
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <h3 className={styles.contentTitle}>Reviews Management</h3>
          <div className={styles.headerActions}>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.emptyState}>
          <FaComments className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Reviews Found</h4>
          <p className={styles.emptyStateText}>
            Reviews from users will appear here as they rate and comment on recipes. You can moderate and manage all reviews from this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <h3 className={styles.contentTitle}>Reviews Management</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      {filteredReviews.length === 0 ? (
        <div className={styles.emptyState}>
          <FaComments className={styles.emptyStateIcon} />
          <h4 className={styles.emptyStateTitle}>No Reviews Match Your Search</h4>
          <p className={styles.emptyStateText}>
            Try adjusting your search terms or clear the search to see all reviews.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Recipe</th>
                  <th className={styles.tableHeader}>User</th>
                  <th className={styles.tableHeader}>Rating</th>
                  <th className={styles.tableHeader}>Comment</th>
                  <th className={styles.tableHeader}>Date</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReviews.map((review) => (
                  <tr key={review.review_id}>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaUtensils style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }} />
                        <strong>{review.recipe?.title || 'Unknown Recipe'}</strong>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaUser style={{ color: '#666', fontSize: '0.9rem' }} />
                        {review.app_user?.username || 'Unknown User'}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {renderStars(review.rating)}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.summaryText} style={{ maxWidth: '250px' }}>
                        {truncateComment(review.comment)}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div>
                        <div style={{ fontWeight: '500' }}>
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {review.created_at ? new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionContainer}>
                        <button
                          className={styles.actionButton}
                          onClick={() => setActionMenuOpenId(
                            actionMenuOpenId === review.review_id ? null : review.review_id
                          )}
                          title="More actions"
                        >
                          &#x22EE;
                        </button>
                        {actionMenuOpenId === review.review_id && (
                          <div className={styles.actionMenu}>
                            <button 
                              className={styles.actionMenuItem}
                              onClick={() => {
                                handleViewFullReview(review);
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaEye /> View Full Review
                            </button>
                            <button 
                              className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
                              onClick={() => {
                                handleDelete('review', review.review_id, 'review_id');
                                setActionMenuOpenId(null);
                              }}
                            >
                              <FaTrash /> Delete Review
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
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

export default AdminReviewsTab;