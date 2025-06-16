import React from "react";
import styles from "../../components/Home/SliderCategories.module.css";
import RecipeCard from "../Common/RecipeCard/RecipeCard";

const SliderCategories = ({ recipes }) => {
  console.log("recipes in SliderCategories:", recipes);
  return (
    <div className={styles.container}>
      <h1 className={styles.sliderTitle}>Sweet Tooth</h1>
      <div className={styles.recipes}>
        {recipes && recipes.slice(0,4).map((recipe) => (
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          ))}
      </div>
    </div>
  );
};

export default SliderCategories;
