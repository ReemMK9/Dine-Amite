import React from "react";
import CollectionCard from "../Common/CollectionCard";
import styles from "./Collections.module.css";

const Collections = () => {
  return (
    <div className={styles.collectionsContainer}>
      <h1 className={styles.collectionsTitle}>Hand-Picked Collections</h1>
      <div className={styles.collectionsGrid}>
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
    </div>
    </div>
  );
};

export default Collections;
