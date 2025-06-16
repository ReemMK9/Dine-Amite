import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeCard.module.css";
import supabase from "../../../config/supabaseClient";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (recipe?.recipe_id) {
      navigate(`/recipedetails/${recipe.recipe_id}`);
    }
  };

  if (!recipe) return null;

  return (
    <div
      className={styles.recipeCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className={styles.recipeImage}>
        <img
          className={styles.recImage}
          src={recipe.image || "/placeholder.jpg"}
          alt={recipe.title || "Recipe"}
        />
      </div>
      <h2 className={styles.recipeTitle}>{recipe.title}</h2>
      <div className={styles.recipeDuration}>{recipe.ready_in}</div>
    </div>
  );
};

export default RecipeCard;
