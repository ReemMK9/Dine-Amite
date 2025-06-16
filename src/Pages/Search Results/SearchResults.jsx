import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./SearchResults.module.css";
import Navbar from "../../components/Common/Navbar/Navbar";
import Footer from "../../components/Common/Footer/Footer";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import SearchResultsHeader from "./SearchResultsHeader";
import supabase from "../../config/supabaseClient";


const SearchResults = () => {
  const { query } = useParams();
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipe")
      .select(`
        *,
        recipe_category:recipe_id (
          name
        )
      `)
      .or(
        `title.ilike.%${query}%,description.ilike.%${query}%,recipe_category.category_name.ilike.%${query}%`
      );
      setRecipes(data || []);
      setLoading(false);
    };

    if (query) 
      fetchRecipes();
    else {
      setRecipes([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className={styles.pageContainer}>
      <SearchResultsHeader />
      <div className={styles.results}>
        {recipes && recipes.slice(0,6).map((recipe) => (
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          ))}
      </div>
    </div>
  );
};

export default SearchResults;
