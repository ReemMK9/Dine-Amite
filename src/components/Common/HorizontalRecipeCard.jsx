import React from "react";
import styles from "./HorizontalRecipeCard.module.css";

const HorizontalRecipeCard = () => {
  return (
    <div className={styles.recipeCard}>
      <div className={styles.recipeImage}>
        {/* <img src="" alt="" /> */}
      </div>
      <div>
        <div>Rating</div>
        <h4 className={styles.recipeTitle}>
          Decadent Raspberry and Cream Cake
        </h4>
      </div>
    </div>
  );
};

export default HorizontalRecipeCard;
