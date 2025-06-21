import React, { useEffect, useState } from "react";
import CircularCard from "../Common/CircularCard";
import styles from "./PopularCategories.module.css";
import supabase from "../../config/supabaseClient";

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch all categories
        const { data: allCategories, error: categoryError } = await supabase
          .from('category')
          .select('*');
        
        if (categoryError) {
          setError('Could not fetch categories');
          console.log(categoryError);
          return;
        }

        if (!allCategories || allCategories.length === 0) {
          setError('No categories found');
          return;
        }

        const shuffledCategories = allCategories.sort(() => 0.5 - Math.random());
        const selectedCategories = shuffledCategories.slice(0, 3);

        const usedImages = new Set();
        const categoriesWithImages = [];

        // Process categories one by one to avoid image repetition
        for (const category of selectedCategories) {
          // Get recipe IDs for this category
          const { data: recipeCategories, error: recipeCatError } = await supabase
            .from('recipe_category')
            .select('recipe_id')
            .eq('category_id', category.category_id);

          if (recipeCatError || !recipeCategories || recipeCategories.length === 0) {
            continue; // Skip categories with no recipes
          }

          // Get recipe details for these IDs
          const recipeIds = recipeCategories.map(rc => rc.recipe_id);
          const { data: recipes, error: recipeError } = await supabase
            .from('recipe')
            .select('recipe_id, image')
            .in('recipe_id', recipeIds)
            .not('image', 'is', null); // Only get recipes with images

          if (recipeError || !recipes || recipes.length === 0) {
            continue; 
          }

          // Find an unused image for this category
          const availableRecipes = recipes.filter(recipe => !usedImages.has(recipe.image));
          
          if (availableRecipes.length === 0) {
            continue; // Skip if all images are already used
          }

          // Pick a random recipe image from available ones
          const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
          usedImages.add(randomRecipe.image);
          
          categoriesWithImages.push({
            ...category,
            imageUrl: randomRecipe.image,
            recipeCount: recipeCategories.length
          });

          // Stop when we have 6 categories with unique images
          if (categoriesWithImages.length >= 4) {
            break;
          }
        }

        // If we don't have enough categories, try to get more from remaining categories
        if (categoriesWithImages.length < 4) {
          const remainingCategories = allCategories.filter(cat => 
            !selectedCategories.some(selected => selected.category_id === cat.category_id)
          );

          for (const category of remainingCategories) {
            if (categoriesWithImages.length >= 4) break;

            const { data: recipeCategories, error: recipeCatError } = await supabase
              .from('recipe_category')
              .select('recipe_id')
              .eq('category_id', category.category_id);

            if (recipeCatError || !recipeCategories || recipeCategories.length === 0) {
              continue;
            }

            const recipeIds = recipeCategories.map(rc => rc.recipe_id);
            const { data: recipes, error: recipeError } = await supabase
              .from('recipe')
              .select('recipe_id, image')
              .in('recipe_id', recipeIds)
              .not('image', 'is', null);

            if (recipeError || !recipes || recipes.length === 0) {
              continue;
            }

            const availableRecipes = recipes.filter(recipe => !usedImages.has(recipe.image));
            
            if (availableRecipes.length === 0) {
              continue;
            }

            const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
            usedImages.add(randomRecipe.image);
            
            categoriesWithImages.push({
              ...category,
              imageUrl: randomRecipe.image,
              recipeCount: recipeCategories.length
            });
          }
        }

        setCategories(categoriesWithImages);
        setError(null);
      } catch (err) {
        setError('Could not fetch data');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCategories();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className={`col-10 ml-0 ${styles.container}`}>
          <h1 className={`ml-0 ${styles.sectionTitle}`}>Popular Categories</h1>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className={`col-10 ml-0 ${styles.container}`}>
          <h1 className={`ml-0 ${styles.sectionTitle}`}>Popular Categories</h1>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={`col-10 ml-0 ${styles.container}`}>
        <h1 className={`ml-0 ${styles.sectionTitle}`}>Popular Categories</h1>
        <div className="row justify-content-center gx-2 gy-2">
          {categories.map((category) => (
            <div key={category.category_id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
              <CircularCard 
                category={category}
                imageUrl={category.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;