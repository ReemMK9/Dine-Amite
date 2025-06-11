import React from "react";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import styles from "../Recipes/Recipes.module.css";

const Recipes = () => {
  return (
  <div className={styles.recipesPage}>
    <h1 className={styles.recipesHeader}>Recipes</h1>
    <hr/>
      <div className={styles.recipesContainer}>
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>
      </div>
  );
};

export default Recipes;
