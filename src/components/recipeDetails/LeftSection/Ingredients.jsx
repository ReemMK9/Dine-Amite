import React from 'react'
import styles from "./Ingredients.module.css"

function formatAmount(amount) {
  if (!amount) return "";
  const whole = Math.floor(amount);
  const decimal = +(amount - whole).toFixed(2);

  const fractionMap = {
    0.25: "1/4",
    0.33: "1/3",
    0.5: "1/2",
    0.66: "2/3",
    0.75: "3/4",
  };

  let fraction = fractionMap[decimal] || (decimal ? decimal : "");

  if (whole && fraction) return `${whole} ${fraction}`;
  if (whole) return `${whole}`;
  if (fraction) return `${fraction}`;
  return amount;
}

function formatUnit(unit) {
  const map = {
    c: "cups",
    t: "teaspoons",
    T: "tablespoons",
    g: "grams",
    kg: "kilograms",
    l: "liters",
    ml: "milliliters",
  };
  return map[unit] || unit || "";
}

const Ingredients = ({ ingredients }) => {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Ingredients</h2>
      <div className={styles.ingredientsContainer}>
        <ul className={styles.ingredientsList}>
          {ingredients && ingredients.length > 0 ? (
            ingredients.map((item, idx) => (
              <li className={styles.ingredientItem} key={idx}>
                {formatAmount(item.amount)} {formatUnit(item.unit)} {item.ingredient?.name}
              </li>
            ))
          ) : (
            <li className={styles.ingredientItem}>No ingredients listed.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Ingredients