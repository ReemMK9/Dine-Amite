import React from "react";
import styles from "./HorizontalRecipeCard.module.css";
import { Link } from "react-router-dom"

const HorizontalRecipeCard = ({ recipe }) => {
  return (
    <Link
      to={`/recipedetails/${recipe.recipe_id}`}
      className={styles.linkWrapper}
    >
    <div className={styles.recipeCard}>
      <div className={styles.recipeImageContainer}>
        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className={styles.recipeImage}/>
        )}
      </div>
      <div className={styles.recipeTitleContainer}>
        <h4 className={styles.recipeTitle}>
          {recipe.title}
        </h4>
      </div>
    </div>
    </Link>
  );
};

export default HorizontalRecipeCard;
