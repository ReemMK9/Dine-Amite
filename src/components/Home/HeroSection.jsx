import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeroSection.module.css";
import supabase from "../../config/supabaseClient";

const HeroSection = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const { count, error: countError } = await supabase
          .from('recipe')
          .select('*', { count: 'exact', head: true });

        if (countError || !count) {
          setError('No recipes found');
          return;
        }

        const randomOffset = Math.floor(Math.random() * count);
        const { data: recipes, error: recipeError } = await supabase
          .from('recipe')
          .select('recipe_id, title, image, ready_in, servings')
          .range(randomOffset, randomOffset)
          .limit(1);

        if (recipeError || !recipes?.length) {
          setError('Failed to load recipe');
          return;
        }

        setRecipe(recipes[0]);
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomRecipe();
  }, []);

  const handleRecipeClick = () => {
    if (recipe?.recipe_id) {
      navigate(`/recipedetails/${recipe.recipe_id}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingPlaceholder}>
          <h2>Loading Recipe...</h2>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className={styles.container}>
        <div className={styles.errorPlaceholder}>
          <h2>Discover Amazing Recipes</h2>
          <p>Explore our collection of delicious recipes</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        {recipe.image ? (
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className={styles.heroImg}
          />
        ) : (
          <div className={styles.noImagePlaceholder}>
            <h2>{recipe.title}</h2>
          </div>
        )}
      </div>
      
      <div className={styles.contentSection}>
        <div className={styles.header}>
          <h1 
            className={styles.title}
            onClick={handleRecipeClick}
          >
            {recipe.title}
          </h1>
          
          <button
            className={styles.saveButton}
            onClick={(e) => e.stopPropagation()}
          >
            <i className="material-symbols-outlined">favorite</i>
          </button>
        </div>
        
        {(recipe.ready_in || recipe.servings) && (
          <div className={styles.recipeInfo}>
            {recipe.ready_in && (
              <span>Ready in {recipe.ready_in} minutes</span>
            )}
            {recipe.servings && (
              <span>Serves {recipe.servings}</span>
            )}
          </div>
        )}
        
        <button 
          className={styles.viewButton}
          onClick={handleRecipeClick}
        >
          View Full Recipe
        </button>
      </div>
    </div>
  );
};

export default HeroSection;