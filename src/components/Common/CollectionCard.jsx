import React from "react";
import styles from "./CollectionCard.module.css";

const CollectionCard = ({ collection }) => {
  return (
    <div className={styles.collectionCard}>
      <div className={styles.collectionImage}></div>
      <div className={styles.collectionInfo}>
        <h2 className={styles.collectionTitle}>{collection.title}</h2>
        <button className={styles.collectionBtn}>
          {collection.recipeCount} Recipes
        </button>
      </div>
    </div>
  );
};

export default CollectionCard;
