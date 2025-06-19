// src/components/AdminView/AdminModal.jsx

import React, { useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import styles from './AdminModal.module.css';

const AdminModal = ({
  modalType,
  selectedItem,
  formData,
  setFormData,
  onSave,
  onClose,
  loading
}) => {
  // Form field configurations for different entity types
  const getFormFields = () => {
    switch (modalType) {
      case 'user':
        return [
          { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'Enter username' },
          { name: 'display_name', label: 'Display Name', type: 'text', required: true, placeholder: 'Enter display name' }
        ];
      case 'recipe':
        return [
          { name: 'title', label: 'Recipe Title', type: 'text', required: true, placeholder: 'Enter recipe title' },
          { name: 'image', label: 'Image URL', type: 'url', placeholder: 'https://example.com/image.jpg' },
          { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Brief description of the recipe' },
          { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'Step-by-step cooking instructions' },
          { name: 'preparation_time', label: 'Prep Time (minutes)', type: 'number', min: 0, placeholder: '15' },
          { name: 'cooking_time', label: 'Cook Time (minutes)', type: 'number', min: 0, placeholder: '30' },
          { name: 'servings', label: 'Servings', type: 'number', min: 1, placeholder: '4' }
        ];
      case 'category':
        return [
          { name: 'name', label: 'Category Name', type: 'text', required: true, placeholder: 'Enter category name' }
        ];
      case 'ingredient':
        return [
          { name: 'name', label: 'Ingredient Name', type: 'text', required: true, placeholder: 'Enter ingredient name' },
          { name: 'name_alt', label: 'Alternative Name', type: 'text', required: true, placeholder: 'Enter alternative name' }
        ];
      default:
        return [];
    }
  };

  const getModalTitle = () => {
    const action = selectedItem ? 'Edit' : 'Add';
    const entity = modalType.charAt(0).toUpperCase() + modalType.slice(1);
    return `${action} ${entity}`;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    const firstInput = document.querySelector(`.${styles.formInput}`);
    if (firstInput) {
      firstInput.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formFields = getFormFields();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{getModalTitle()}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            disabled={loading}
            title="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBody}>
            {formFields.map((field) => (
              <div key={field.name} className={styles.formGroup}>
                <label htmlFor={field.name} className={styles.formLabel}>
                  {field.label}
                  {field.required && <span className={styles.required}>*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={styles.formTextarea}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={loading}
                    rows={4}
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={styles.formInput}
                    placeholder={field.placeholder}
                    required={field.required}
                    min={field.min}
                    disabled={loading}
                  />
                )}
                
                {field.type === 'url' && formData[field.name] && (
                  <div className={styles.imagePreview}>
                    <img 
                      src={formData[field.name]} 
                      alt="Preview" 
                      className={styles.previewImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  {selectedItem ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;