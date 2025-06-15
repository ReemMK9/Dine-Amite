import React from "react";
import styles from "./Landing.module.css";

const Landing = ({ recipe }) => {
  if (!recipe) return <p>Loading...</p>
  return (
    <div>
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
        <hr />
        <p className={styles.description}>
          Details about the selected recipe will be displayed here.
        </p>
      </div>

      <div className={styles.recipeImage}>
        <img src={recipe.image} alt={recipe.title}></img>
      </div>
    </div>
  );
};

export default Landing;
