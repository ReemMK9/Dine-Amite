import React from "react";
import styles from "./NutritionFacts.module.css";

const NutritionFacts = () => {
  return (
    <div className={styles.container}>
      <div className={styles.nutritionFacts}>
        <h2 className={styles.title}>Nutrition Facts</h2>
        <div className={styles.nutritionInfo}>
          <p>Calories: 200</p>
          <hr />
          <p>Protein: 10g</p>
          <hr />
          <p>Carbohydrates: 30g</p>
          <hr />
          <p>Sugar: 5g</p>
          <hr />
          <p>Fiber: 3g</p>
          <hr />
          <p>Sodium: 150mg</p>
          <hr />
          <p>Fat: 5g</p>
        </div>
      </div>
    </div>
  );
};

export default NutritionFacts;
