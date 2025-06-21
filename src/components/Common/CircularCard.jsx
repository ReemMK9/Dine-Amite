import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from "./CircularCard.module.css"

const CircularCard = ({ category, imageUrl }) => {
  const navigate = useNavigate();
  
  // capitalize category name for display
  const displayName = category?.name 
    ? category.name.charAt(0).toUpperCase() + category.name.slice(1)
    : "Category";

  const handleClick = () => {
    if (category?.category_id && category?.name) {
      // navigate to category results page with category ID and name
      navigate(`/category/${category.category_id}/${encodeURIComponent(category.name)}`);
    }
  };

  return (
    <div 
      className={styles.cardContainer}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      style={{ cursor: 'pointer' }}
    >
      <div 
        className={styles.categoryImgCont}
        // style={{
        //   backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   backgroundColor: imageUrl ? 'transparent' : '#ddd'
        // }}
      ><img src={imageUrl} className={styles.categoryImage}></img></div>
      <h3 className={styles.categoryTitle}>{displayName}</h3>
    </div>
  )
}

export default CircularCard