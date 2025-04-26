import React from "react";
import styles from "./FullSubscriptionSection.module.css";

const FullSubscriptionSection = () => {
  return (
    <div className={styles.sectionContainer}>
      <h1 className={styles.sectionTitle}>Deliciousness to your inbox</h1>
      <p className={styles.sectionDescription}>
        Enjoy weekly hand picked recipes and recommendations.
      </p>
      <div className={styles.subscriptionForm}>
    <div className={styles.formInput}>
    <input type="email" placeholder="Enter your email" />
    <button type="submit">Join</button>
    </div>
        <p className={styles.smallText}>
          By joining our newsletter, you agree to our
          <a href="/">Terms and Conditions</a>
        </p>
      </div>
    </div>
  );
};

export default FullSubscriptionSection;
