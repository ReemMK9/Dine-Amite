import React from "react";
import CircularCard from "../Common/CircularCard";
import styles from "./PopularCategories.module.css";

const PopularCategories = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>Popular Categories</h1>
    <div className={styles.categoriesCards}>
    <CircularCard />
      <CircularCard />
      <CircularCard />
      <CircularCard />
      <CircularCard />
      <CircularCard />
    </div>
    </div>
  );
};

export default PopularCategories;
