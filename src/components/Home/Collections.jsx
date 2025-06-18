import React, { useEffect, useState } from "react";
import CollectionCard from "../Common/CollectionCard";
import styles from "./Collections.module.css";
import supabase from "../../config/supabaseClient";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      // For now, dummy cards for layout testing
      const dummy = Array(6).fill().map((_, i) => ({
        id: i + 1,
        title: `Collection ${i + 1}`,
        recipeCount: 100,
        image: ""
      }));
      setCollections(dummy);
    };

    fetchCollections();
  }, []);

  return (
    <div className={`container ${styles.collectionsContainer}`}>
      <h1 className={styles.collectionsTitle}>Hand-Picked Collections</h1>
      <div className="row g-4">
        {collections.map((collection) => (
              <div key={collection.id} className="col-12 col-md-6 col-xl-3 d-flex justify-content-center">

            <CollectionCard collection={collection} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
