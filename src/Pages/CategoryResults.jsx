import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./CategoryResults.module.css";
import RecipeCard from "../components/Common/RecipeCard/RecipeCard";
import supabase from "../config/supabaseClient";

const CategoryResults = () => {
  const { categoryId, categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecipes, setTotalRecipes] = useState(0);

  useEffect(() => {
    const fetchCategoryRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get recipe IDs for this category
        const { data: recipeCategories, error: recipeCatError } = await supabase
          .from('recipe_category')
          .select('recipe_id')
          .eq('category_id', categoryId);

        if (recipeCatError) {
          setError('Could not fetch category recipes');
          console.log(recipeCatError);
          return;
        }

        if (!recipeCategories || recipeCategories.length === 0) {
          setError('No recipes found in this category');
          return;
        }

        setTotalRecipes(recipeCategories.length);

        // Get full recipe details
        const recipeIds = recipeCategories.map(rc => rc.recipe_id);
        const { data: categoryRecipes, error: recipeError } = await supabase
          .from('recipe')
          .select('*')
          .in('recipe_id', recipeIds)
          .order('title', { ascending: true });

        if (recipeError) {
          setError('Could not fetch recipe details');
          console.log(recipeError);
          return;
        }

        setRecipes(categoryRecipes || []);
      } catch (err) {
        setError('An unexpected error occurred');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryRecipes();
    }
  }, [categoryId]);

  // Format category name for display
  const displayName = categoryName 
    ? decodeURIComponent(categoryName).charAt(0).toUpperCase() + decodeURIComponent(categoryName).slice(1)
    : 'Category';

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className="container">
          <div className={styles.header}>
            <h1>Loading {displayName} Recipes...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className="container">
          <div className={styles.header}>
            <h1>{displayName} Recipes</h1>
            <p className={styles.error}>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.header}>
          <h1>{displayName} Recipes</h1>
          <p className={styles.subtitle}>
            Discover {totalRecipes} delicious {displayName.toLowerCase()} recipes
          </p>
          <hr className={styles.divider} />
        </div>

        <div className={styles.results}>
          {recipes.length > 0 ? (
            <div className="row g-4">
              {recipes.map((recipe) => (
                <div key={recipe.recipe_id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>No recipes found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryResults;