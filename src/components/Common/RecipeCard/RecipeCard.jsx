import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeCard.module.css";
import SaveRecipeOverlay from "./../SaveRecipeOverlay";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = () => {
    if (recipe?.recipe_id) {
      navigate(`/recipedetails/${recipe.recipe_id}`);
    }
  };

  if (!recipe) return null;

  return (
    <>
      <div
        className={styles.recipeCard}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        <div className={styles.recipeImage}>
          <img
            className={styles.recImage}
            src={recipe.image || "/placeholder.jpg"}
            alt={recipe.title || "Recipe"}
          />
          <button
            onClick={e => {
              e.stopPropagation();
              setShowOverlay(true);
            }}
            className={styles.saveButton}
            title="Save to list"
          >
            <i className="material-symbols-outlined">add_circle</i>
          </button>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.recipeTitleContainer}>
            <h2 className={styles.recipeTitle}>{recipe.title}</h2>
          </div>
          {/* <div className={styles.recipeDuration}>{recipe.ready_in}</div> */}
        </div>
      </div>

      <SaveRecipeOverlay
        recipeId={recipe.recipe_id}
        open={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
    </>
  );
};

export default RecipeCard;