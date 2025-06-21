import React from "react";
import notfoundimg from "../../assets/notfound.png";
import styles from "./NotFound.module.css";
const NotFound = () => {
  return (
    <div className={styles.container}>
      <img src={notfoundimg} alt="Not Found" />
    </div>
  );
};

export default NotFound;
