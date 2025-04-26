import React from "react";
import styles from "./Feedback.module.css";
import PrimaryButton from "../Common/Buttons/PrimaryButton";
import SecondaryButton from "../Common/Buttons/SecondaryButton";

const Feedback = () => {
  return <div className={styles.feedbackContainer}>
    <h1>Already made this?</h1>
    <SecondaryButton/>
    <hr className={styles.separator}/>
  </div>;
};

export default Feedback;
