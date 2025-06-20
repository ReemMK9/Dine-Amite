import React from "react";
import styles from "./PrepInfo.module.css";

const PrepInfo = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <div className={`${styles.container}`}>
      <div className={styles.row}>
        <div className={styles.section}>
          <h5>Prep Time</h5>
          <p>{recipe.preparation_time ? `${recipe.preparation_time} minutes` : "N/A"}</p>
        </div>
        <div className={styles.section}>
          <h5>Cook Time</h5>
          <p>{recipe.cooking_time ? `${recipe.cooking_time} minutes` : "N/A"}</p>
        </div>
        <div className={styles.section}>
          <h5>Servings</h5>
          <p>{recipe.servings ? `${recipe.servings} people` : "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default PrepInfo;
