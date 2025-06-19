import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CollectionCard.module.css";

const CollectionCard = ({ collection }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (collection?.id && collection?.title) {
      // Navigate to category results page with collection ID and title
      // Remove "Collection " prefix if it exists and use the actual category name
      const categoryName = collection.title.replace(/^Collection \d+$/, collection.title);
      navigate(`/category/${collection.id}/${encodeURIComponent(categoryName.toLowerCase())}`);
    }
  };

  return (
    <div 
      className={styles.collectionCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      style={{ cursor: 'pointer' }}
    >
      <div 
        className={styles.collectionImage}
        style={{
          backgroundImage: collection.image ? `url(${collection.image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: collection.image ? 'transparent' : '#ddd'
        }}
      ></div>
      <div className={styles.collectionInfo}>
        <h2 className={styles.collectionTitle}>{collection.title}</h2>
        <button className={styles.collectionBtn}>
          {collection.recipeCount} Recipes
        </button>
      </div>
    </div>
  );
};

export default CollectionCard;