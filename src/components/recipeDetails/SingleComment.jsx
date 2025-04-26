import React from "react";
import styles from "./SingleComment.module.css";

const SingleComment = () => {
  return (
    <div className={styles.commentContainer}>
      <div className={styles.userIcon}></div>
      <div className={styles.commentContent}>
        <div className={styles.userInfo}>
          <h4>User Name</h4>
          <p>Date</p>
        </div>
        <div>
          <h5>Comment Text</h5>
        </div>
        <div>
          <button className={styles.commentReactions}>Like</button>
          <button className={styles.commentReactions}>Dislike</button>
        </div>
      </div>
    </div>
  );
};

export default SingleComment;
