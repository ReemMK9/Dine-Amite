import React from "react";
import CircularCard from "../Common/CircularCard";
import styles from "./PopularCategories.module.css";

const PopularCategories = () => {
  return (
    <div className="container">
      {" "}
      {/* centers col-10 */}
      <div className={`col-10 ml-0 ${styles.container}`}>
        <h1 className={`ml-0 ${styles.sectionTitle}`}>Popular Categories</h1>
        <div className="row gx-4 gy-5">
          {" "}
          {/* g-4 gives space between cards */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col-6 col-md-3 col-xl-2 ml-0">
              <CircularCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
