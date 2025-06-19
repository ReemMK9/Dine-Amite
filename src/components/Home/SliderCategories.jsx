import React from "react";
import styles from "../../components/Home/SliderCategories.module.css";
import RecipeCard from "../Common/RecipeCard/RecipeCard";

const SliderCategories = ({ category, recipes }) => {
  // Don't render if no category or no recipes
  if (!category || !recipes || recipes.length === 0) {
    return null;
  }

  // Capitalize the category name for display
  const displayName = category.name
    ? category.name.charAt(0).toUpperCase() + category.name.slice(1)
    : "Recipes";

  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.sliderTitle}>{displayName}</h1>

      {/* Bootstrap row with gutter spacing */}
      <div className="row g-4">
        {recipes.map((recipe) => (
          <div key={recipe.recipe_id} className="col-12 col-md-6 col-xl-3 d-flex">
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderCategories;