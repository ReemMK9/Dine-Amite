import React from "react";
import styles from "./HeroSection.module.css";
import landing from "../../../assets/landing.jpg";

const HeroSection = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className={`row ${styles.container}`}>
            {/* Left Column: 8 cols on large, 12 on smaller */}
            <div className="col-12 col-lg-8 p-0">
              <div className={styles.heroImgContainer}>
                <img src={landing} alt="" className={styles.heroImg} />
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className={styles.heroText}>
                <h1>Recipe Title</h1>
                <h3>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et
                  quo architecto laborum quasi quia provident magni, blanditiis
                  id doloremque optio accusamus
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
