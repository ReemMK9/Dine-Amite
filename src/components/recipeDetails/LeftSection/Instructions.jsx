import React from 'react'
import styles from './Instructions.module.css'

const Instructions = () => {
  return (
    <div>
      <h2 className={styles.title}>Instructions</h2>
      <ol className={styles.instructionsList}>
        <li>Preheat the oven to 350°F (175°C).</li>
        <li>In a bowl, mix flour, sugar, and salt.</li>
        <li>Add eggs and milk, and stir until smooth.</li>
        <li>Pour the batter into a greased baking dish.</li>
        <li>Bake for 30-35 minutes or until golden brown.</li>
        <li>Let it cool before serving.</li>
        </ol>
      <p className={styles.note}>Note: Adjust baking time based on your oven.</p>
    </div>
  )
}

export default Instructions