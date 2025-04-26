import React from 'react'
import styles from "./CircularCard.module.css"

const CircularCard = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.categoryImg}></div>
      <h3 className={styles.categoryTitle}>Category</h3>
    </div>
  )
}

export default CircularCard