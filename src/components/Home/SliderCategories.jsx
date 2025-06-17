import React from "react";
import styles from "../../components/Home/SliderCategories.module.css";
import RecipeCard from "../Common/RecipeCard/RecipeCard";

const SliderCategories = ({ recipes }) => {
  return (
    <div className={`container ${styles.container}`}>
      <h1 className={styles.sliderTitle}>Sweet Tooth</h1>

      {/* Bootstrap row with gutter spacing */}
      <div className="row g-4">
        {recipes &&
          recipes.slice(0, 4).map((recipe) => (
            <div key={recipe.recipe_id} className="col-12 col-md-6 col-xl-3 d-flex">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SliderCategories;
