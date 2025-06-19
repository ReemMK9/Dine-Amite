import React, { useEffect, useState } from "react";
import CollectionCard from "../Common/CollectionCard";
import styles from "./Collections.module.css";
import supabase from "../../config/supabaseClient";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthyCollections = async () => {
      try {
        setLoading(true);
        
        // First, get recipes with nutrition score > 20
        const { data: healthyRecipes, error: nutritionError } = await supabase
          .from('recipe_nutrition')
          .select(`
            recipe_id,
            nutrition_score,
            recipe:recipe_id (
              recipe_id,
              title,
              image
            )
          `)
          .gt('nutrition_score', 20);

        if (nutritionError) {
          console.log('Error fetching nutrition data:', nutritionError);
          setError('Could not fetch healthy recipes');
          return;
        }

        if (!healthyRecipes || healthyRecipes.length === 0) {
          setError('No healthy recipes found');
          return;
        }

        // Get the recipe IDs
        const healthyRecipeIds = healthyRecipes.map(hr => hr.recipe_id);

        // Get categories that contain these healthy recipes
        const { data: recipeCategories, error: recipeCatError } = await supabase
          .from('recipe_category')
          .select(`
            category_id,
            recipe_id,
            category:category_id (
              category_id,
              name
            )
          `)
          .in('recipe_id', healthyRecipeIds);

        if (recipeCatError) {
          console.log('Error fetching recipe categories:', recipeCatError);
          setError('Could not fetch categories');
          return;
        }

        if (!recipeCategories || recipeCategories.length === 0) {
          setError('No categories found for healthy recipes');
          return;
        }

        // Group by category and count healthy recipes per category
        const categoryMap = new Map();
        
        recipeCategories.forEach(rc => {
          const categoryId = rc.category_id;
          const categoryName = rc.category?.name;
          
          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
              category_id: categoryId,
              name: categoryName,
              healthyRecipeIds: [],
              recipeCount: 0
            });
          }
          
          const category = categoryMap.get(categoryId);
          if (!category.healthyRecipeIds.includes(rc.recipe_id)) {
            category.healthyRecipeIds.push(rc.recipe_id);
            category.recipeCount++;
          }
        });

        // Convert to array and sort by number of healthy recipes (descending)
        const categoriesArray = Array.from(categoryMap.values())
          .sort((a, b) => b.recipeCount - a.recipeCount);

        // Take categories and ensure unique images
        const usedImages = new Set();
        const categoriesWithUniqueImages = [];
        
        for (const category of categoriesArray) {
          // Get healthy recipes with images from this category
          const categoryHealthyRecipes = healthyRecipes.filter(hr => 
            category.healthyRecipeIds.includes(hr.recipe_id) && 
            hr.recipe?.image &&
            !usedImages.has(hr.recipe.image) // Check if image is not already used
          );

          if (categoryHealthyRecipes.length === 0) {
            continue; // Skip categories with no unique images
          }

          // Pick a random unique image
          const randomRecipe = categoryHealthyRecipes[
            Math.floor(Math.random() * categoryHealthyRecipes.length)
          ];
          
          usedImages.add(randomRecipe.recipe.image);
          
          categoriesWithUniqueImages.push({
            id: category.category_id,
            title: category.name 
              ? category.name.charAt(0).toUpperCase() + category.name.slice(1)
              : `Collection ${category.category_id}`,
            recipeCount: category.recipeCount,
            image: randomRecipe.recipe.image
          });

          // Stop when we have 4 categories with unique images
          if (categoriesWithUniqueImages.length >= 4) {
            break;
          }
        }

        setCollections(categoriesWithUniqueImages);
        setError(null);
      } catch (err) {
        console.log('Error in fetchHealthyCollections:', err);
        setError('Could not fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthyCollections();
  }, []);

  if (loading) {
    return (
      <div className={`container ${styles.collectionsContainer}`}>
        <h1 className={styles.collectionsTitle}>Hand-Picked Collections</h1>
        <p>Loading healthy collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`container ${styles.collectionsContainer}`}>
        <h1 className={styles.collectionsTitle}>Hand-Picked Collections</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className={`container ${styles.collectionsContainer}`}>
        <h1 className={styles.collectionsTitle}>Hand-Picked Collections</h1>
        <p>No healthy collections found.</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.collectionsContainer}`}>
      <h1 className={styles.collectionsTitle}>Hand-Picked Collections</h1>
      <div className="row g-4">
        {collections.map((collection) => (
          <div key={collection.id} className="col-12 col-md-6 col-xl-3 d-flex justify-content-center">
            <CollectionCard collection={collection} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;