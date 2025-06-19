import React from "react";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import styles from "../Recipes/Recipes.module.css";
import Footer from "../../components/Common/Footer/Footer";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";

const Recipes = ( ) => {
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchRecipes = async () => {
        const { data, error } = await supabase
          .from('recipe')
          .select('*')

          if (error) {
            setError('Could not fetch recipes');
            setRecipes([]);
            console.log(error);
          }
          if (data) {
            setRecipes(data || []);
            setError(null);
          }
    }

    fetchRecipes(); 
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8); // Load 8 more each time
  };

  return (
  <div className={styles.recipesPage}>
    <div className={styles.headerContainer}>
      <h1 className={styles.recipesHeader}>Browse Recipes</h1>
      <hr/>
    </div>
    <div className={styles.recipesContainer}>
      {recipes && recipes.slice(0, visibleCount).map((recipe) => (
          <RecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))}
    </div>
    {visibleCount < recipes.length && (
      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
          Load More
        </button>
      </div>
    )}
    </div>
  );
};

export default Recipes;
