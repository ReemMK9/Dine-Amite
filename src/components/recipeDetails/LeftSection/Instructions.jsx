import React from 'react'
import styles from './Instructions.module.css'

const Instructions = ({ steps }) => {

  let parsedSteps = [];

  // Parse steps from JSON API response
if (typeof steps === "string") {
  try {
    parsedSteps = JSON.parse(steps)?.[0]?.steps || [];
  } catch {
    parsedSteps = [];
  }
} else if (Array.isArray(steps)) {
  parsedSteps = steps;
}
function replaceUnits(text) {
  if (!text) return "";
  return text
    .replace(/\bt\./g, "teaspoon")
    .replace(/\bT\./g, "tablespoon");
}

  return (
    <div>
      <h2 className={styles.title}>Directions</h2>
     {parsedSteps.length > 0 && (
        <div className={styles.stepsSection}>
          {parsedSteps.map((step, idx) => (
            <div className={styles.stepBlock} key={idx}>
              <strong className={styles.stepLabel}>Step {step.number}</strong>
              <div className={styles.stepText}>{replaceUnits(step.step)}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Instructions