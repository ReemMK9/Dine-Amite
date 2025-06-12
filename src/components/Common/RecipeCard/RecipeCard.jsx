import React from "react";
import styles from "./RecipeCard.module.css";

const RecipeCard = () => {
  return (
    <div className={styles.recipeCard}>
      <div className={styles.recipeImage}>
        <img src="" alt="" />
      </div>
      <h2 className={styles.recipeTitle}>Decadent Raspberry and Cream Cake</h2>
      <div className={styles.recipeDuration}>Recipe Duration</div>
    </div>
  );
};

export default RecipeCard;
