import React from "react";
import styles from "./SimilarRecipes.module.css";
import HorizontalRecipeCard from "../../Common/HorizontalRecipeCard";

const SimilarRecipes = () => {
  return <div>
    <h2>Fresh Recipes</h2>
    <div className={styles.similarRecipes}>
      <HorizontalRecipeCard />
      <HorizontalRecipeCard />
      <HorizontalRecipeCard />
      <HorizontalRecipeCard />
      </div>

  </div>;
};

export default SimilarRecipes;
