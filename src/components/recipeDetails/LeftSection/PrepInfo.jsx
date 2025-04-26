import React from "react";
import styles from "./PrepInfo.module.css";

const PrepInfo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h5>Prep Time</h5>
        <p>15 minutes</p>
      </div>
      <div className={styles.section}>
        <h5>Cook Time</h5>
        <p>15 minutes</p>
      </div>
      <div className={styles.section}>
        <h5>Servings</h5>
        <p>4 PEOPLE</p>
      </div>
    </div>
  );
};

export default PrepInfo;
