import React from "react";
import styles from "./HeroSection.module.css";
import landing from "../../../assets/landing.jpg";

const HeroSection = () => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.heroImgContainer}>
          <img src={landing} alt="" className={styles.heroImg} />
        </div>
        <div className={styles.heroText}>
          <h1>Recipe Title</h1>
          <h3>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et quo
            architecto laborum quasi quia provident magni, blanditiis id
            doloremque optio accusamus
          </h3>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
