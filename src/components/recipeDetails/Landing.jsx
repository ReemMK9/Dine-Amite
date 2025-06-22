import React, { useEffect, useState } from "react";
import styles from "./Landing.module.css";
import SaveRecipeOverlay from "../../components/Common/SaveRecipeOverlay";

const Landing = ({ recipe }) => {
  const [showSaveOverlay, setShowSaveOverlay] = useState(false);

  if (!recipe) return <p>Loading...</p>
  return (
    <div className={styles.landingContainer}>
      <div className={styles.landingInfo}>
        {/* <h1 className={styles.recipeTitle}>Recipe Details</h1>
        <div className={styles.author}>
          <div className={styles.authorIcon}>
            <img
              src="https://via.placeholder.com/40"
              alt="User Icon"
              className={styles.authorIconImage}
            />
          </div>
          <p>Author Name</p>
        </div>

        <div className={styles.recipeInfo}>
          <p>Date</p>
          <p>No. of Comments</p>
          <div>Ratings</div>
        </div> */}
        <h1 className={styles.recipeTitle}>{recipe.title}</h1>
        { recipe && (
      <>
        <button className={styles.saveRecipeBtn}
        onClick={() => setShowSaveOverlay(true)}><i className="material-symbols-outlined">favorite</i></button>
        <SaveRecipeOverlay
        recipeId={recipe.recipe_id}
        open={showSaveOverlay}
        onClose={() => setShowSaveOverlay(false)} />
      </>
    )}
      </div>

      <div className={styles.recipeImage}>
        <img src={recipe.image} alt={recipe.title}></img>
      </div>
    </div>
  );
};

export default Landing;
