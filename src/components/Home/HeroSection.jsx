import React from 'react'
import styles from './HeroSection.module.css'

const HeroSection = () => {
  return (
    <div>
      <div className={styles.container}>
        <img src="/" alt="" className={styles.heroImg}/>
        <div className={styles.heroText}>
        <h1>Recipe Title</h1>
        <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et quo architecto laborum quasi quia provident magni, blanditiis id doloremque optio accusamus</h3>
        </div>

      </div>
    </div>
  )
}

export default HeroSection