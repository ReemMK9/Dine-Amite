import React from "react";
import styles from "./CollectionCard.module.css";

const CollectionCard = () => {
  return (
    <div className={styles.collectionCard}>
      <div className={styles.collectionImage}>
        <img src="/" alt="" />
      </div>
      <div className="collectionInfo">
        <h2 className={styles.collectionTitle}>Everything Bagel</h2>
        <button className={styles.collectionBtn}>100 Recipes</button>
      </div>
    </div>
  );
};

export default CollectionCard;
