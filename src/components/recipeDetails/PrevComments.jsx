import React from "react";
import SingleComment from "./SingleComment";
import styles from "./PrevComments.module.css"

const PrevComments = () => {
  return <div className={styles.container}>
    <h2>Comments</h2>
    <hr/>
    <SingleComment/>
    <SingleComment/>
    <SingleComment/>
    <SingleComment/>
  </div>;
};

export default PrevComments;
