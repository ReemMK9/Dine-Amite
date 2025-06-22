import React, { useEffect, useState } from "react";
import styles from "./SimilarRecipes.module.css";
import HorizontalRecipeCard from "../../Common/HorizontalRecipeCard";
import supabase from "../../../config/supabaseClient";

const SimilarRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from("recipe")
        .select("*");
      if (data && data.length > 0) {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setRecipes(shuffled.slice(0, 5));
      } else {
        setRecipes([]);
      }
      setLoading(false);
    };
    fetchRandomRecipes();
  }, []);

  return (
    <div>
      <h2 className={styles.headerTitle}>You'll Also Love</h2>
      <div className={styles.similarRecipes}>
        {loading && <div>Loading...</div>}
        {!loading && recipes.length === 0 && <div>No recipes found.</div>}
        {!loading && recipes.map(recipe => (
          <HorizontalRecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default SimilarRecipes;
