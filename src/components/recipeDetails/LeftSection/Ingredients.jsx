import React from 'react'
import styles from "./Ingredients.module.css"

const Ingredients = () => {
  return (
    <div>
      <h2 className={styles.title}>Ingredients</h2>
      <div className={styles.ingredientsContainer}>
        <ul className={styles.ingredientsList}>
          <li className={styles.ingredientItem}>1 cup of flour</li>
          <li className={styles.ingredientItem}>2 eggs</li>
          <li className={styles.ingredientItem}>1/2 cup of sugar</li>
          <li className={styles.ingredientItem}>1/4 cup of butter</li>
          <li className={styles.ingredientItem}>1 tsp of baking powder</li>
        </ul>
      </div>
    </div>
  )
}

export default Ingredients