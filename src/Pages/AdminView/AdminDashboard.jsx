// src/Pages/AdminView/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from "../../config/supabaseClient";
import styles from "./AdminDashboard.module.css";
import AdminSidebar from "../../components/AdminView/AdminSidebar";
import AdminHeader from "../../components/AdminView/AdminHeader";
import AdminOverview from "../../components/AdminView/AdminOverview";
import AdminUsersTab from "../../components/AdminView/AdminUsersTab";
import AdminRecipesTab from "../../components/AdminView/AdminRecipesTab";
import AdminCategoriesTab from "../../components/AdminView/AdminCategoriesTab";
import AdminReviewsTab from "../../components/AdminView/AdminReviewsTab";
import AdminGroceryListsTab from "../../components/AdminView/AdminGroceryListsTab";
import AdminIngredientsTab from "../../components/AdminView/AdminIngredientsTab";
import AdminSettingsTab from "../../components/AdminView/AdminSettingsTab";
import AdminModal from "../../components/AdminView/AdminModal";
import AdminNotification from "../../components/AdminView/AdminNotification";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Authentication check
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [groceryLists, setGroceryLists] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [dataLoading, setDataLoading] = useState(false);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalReviews: 0,
    totalCategories: 0,
    totalIngredients: 0,
    totalGroceryLists: 0
  });

  const itemsPerPage = 10;

  // Check authentication and admin role
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate('/login');
        return;
      }

      setUser(user);
      setLoading(false);
      fetchAllData();
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  };

  // Data fetching functions
  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchRecipes(),
      fetchCategories(),
      fetchReviews(),
      fetchGroceryLists(),
      fetchIngredients()
    ]);
  };

  const fetchUsers = async () => {
    try {
      const { data: appUsers, error: appError } = await supabase
        .from('app_user')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (appError) throw appError;
      setUsers(appUsers || []);
      setStats(prev => ({ ...prev, totalUsers: appUsers?.length || 0 }));
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users: ' + error.message, 'error');
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipe')
        .select('*')
        .order('synced_at', { ascending: false });
      
      if (error) throw error;
      setRecipes(data || []);
      setStats(prev => ({ ...prev, totalRecipes: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      showNotification('Error fetching recipes: ' + error.message, 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
      setStats(prev => ({ ...prev, totalCategories: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('Error fetching categories: ' + error.message, 'error');
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select(`
          *,
          recipe:recipe_id(title),
          app_user:user_id(username, display_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
      setStats(prev => ({ ...prev, totalReviews: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showNotification('Error fetching reviews: ' + error.message, 'error');
    }
  };

  const fetchGroceryLists = async () => {
    try {
      const { data, error } = await supabase
        .from('grocery_list')
        .select(`
          *,
          app_user:user_id(username, display_name)
        `)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setGroceryLists(data || []);
      setStats(prev => ({ ...prev, totalGroceryLists: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching grocery lists:', error);
      showNotification('Error fetching grocery lists: ' + error.message, 'error');
    }
  };

  const fetchIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredient')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setIngredients(data || []);
      setStats(prev => ({ ...prev, totalIngredients: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      showNotification('Error fetching ingredients: ' + error.message, 'error');
    }
  };

  // Notification system
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Modal management
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
  };

  // CRUD operations
  const handleSave = async () => {
    try {
      setDataLoading(true);
      
      const tableName = getTableName();
      const primaryKey = getPrimaryKey();
      
      if (selectedItem && selectedItem[primaryKey]) {
        // Update existing item
        const { error } = await supabase
          .from(tableName)
          .update(formData)
          .eq(primaryKey, selectedItem[primaryKey]);
        
        if (error) throw error;
        showNotification('Item updated successfully!');
      } else {
        // Create new item
        const { error } = await supabase
          .from(tableName)
          .insert(formData);
        
        if (error) throw error;
        showNotification('Item created successfully!');
      }
      
      // Refresh data
      refreshCurrentTab();
      closeModal();
    } catch (error) {
      console.error('Error saving item:', error);
      showNotification('Error saving item: ' + error.message, 'error');
    }
    setDataLoading(false);
  };

  const handleDelete = async (table, id, primaryKey) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        setDataLoading(true);
        const { error } = await supabase.from(table).delete().eq(primaryKey, id);
        if (error) throw error;
        showNotification('Item deleted successfully!');
        refreshCurrentTab();
      } catch (error) {
        console.error('Error deleting item:', error);
        showNotification('Error deleting item: ' + error.message, 'error');
      }
      setDataLoading(false);
    }
  };

  const getTableName = () => {
    switch (modalType) {
      case 'user': return 'app_user';
      case 'recipe': return 'recipe';
      case 'category': return 'category';
      case 'review': return 'review';
      case 'ingredient': return 'ingredient';
      default: return '';
    }
  };

  const getPrimaryKey = () => {
    switch (modalType) {
      case 'user': return 'user_id';
      case 'recipe': return 'recipe_id';
      case 'category': return 'category_id';
      case 'review': return 'review_id';
      case 'ingredient': return 'ingredient_id';
      default: return 'id';
    }
  };

  const refreshCurrentTab = () => {
    switch (activeTab) {
      case 'users': fetchUsers(); break;
      case 'recipes': fetchRecipes(); break;
      case 'categories': fetchCategories(); break;
      case 'reviews': fetchReviews(); break;
      case 'grocery-lists': fetchGroceryLists(); break;
      case 'ingredients': fetchIngredients(); break;
    }
  };

  // Helper functions
  const getFilteredData = (data, searchFields) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (data) => Math.ceil(data.length / itemsPerPage);

  // Handle tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setSearchTerm('');
    setActionMenuOpenId(null);
  };

  // Loading screen
  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <h2>Loading Admin Dashboard...</h2>
          <p>Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Main render
  const renderContent = () => {
    const commonProps = {
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
      loading: dataLoading
    };

    switch (activeTab) {
      case 'overview':
        return <AdminOverview stats={stats} />;
      case 'users':
        return <AdminUsersTab users={users} {...commonProps} />;
      case 'recipes':
        return <AdminRecipesTab recipes={recipes} {...commonProps} />;
      case 'categories':
        return <AdminCategoriesTab categories={categories} {...commonProps} />;
      case 'ingredients':
        return <AdminIngredientsTab ingredients={ingredients} {...commonProps} />;
      case 'reviews':
        return <AdminReviewsTab reviews={reviews} {...commonProps} />;
      case 'grocery-lists':
        return <AdminGroceryListsTab groceryLists={groceryLists} {...commonProps} />;
      case 'settings':
        return <AdminSettingsTab />;
      default:
        return <AdminOverview stats={stats} />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />
      
      <div className={styles.mainContent}>
        <AdminHeader 
          activeTab={activeTab}
          user={user}
          onBackToSite={() => navigate('/')}
        />
        
        {renderContent()}
      </div>

      {/* Modal */}
      {showModal && (
        <AdminModal
          modalType={modalType}
          selectedItem={selectedItem}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onClose={closeModal}
          loading={dataLoading}
        />
      )}

      {/* Notification */}
      {notification.show && (
        <AdminNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}

      {/* Click outside to close action menus */}
      {actionMenuOpenId && (
        <div
          className={styles.backdrop}
          onClick={() => setActionMenuOpenId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;