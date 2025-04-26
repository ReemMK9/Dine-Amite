import React from "react";
import styles from "../../components/Home/SliderCategories.module.css";
import RecipeCard from "../Common/RecipeCard/RecipeCard";

const SliderCategories = () => {
  return (
    <div className={styles.container}>
      <h1>Sweet Tooth</h1>
      <div className={styles.recipes}>
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>
    </div>
  );
};

export default SliderCategories;
