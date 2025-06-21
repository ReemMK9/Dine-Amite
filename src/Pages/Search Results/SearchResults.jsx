import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./SearchResults.module.css";
import Navbar from "../../components/Common/Navbar/Navbar";
import Footer from "../../components/Common/Footer/Footer";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import SearchResultsHeader from "./SearchResultsHeader";
import supabase from "../../config/supabaseClient";
import SearchFilters from "../../components/Common/SearchFilters/SearchFilters";


const SearchResults = () => {
  const { query } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);

      //get ingredient IDs matching search query
      const { data: ingredients } = await supabase
        .from("ingredient")
        .select("ingredient_id")
        .ilike("name", `%${query}%`);
      const ingredientIds = ingredients?.map(i => i.ingredient_id) || [];

      //find IDs of recipes that use those ingredients
      let recipeIdsByIngredient = [];
      if (ingredientIds.length > 0) {
        const { data: recipeIngredients } = await supabase
          .from("recipe_ingredient")
          .select("recipe_id")
          .in("ingredient_id", ingredientIds);
        recipeIdsByIngredient = recipeIngredients?.map(ri => ri.recipe_id) || [];
      }

      //get category IDs matching search query
      const { data: categories } = await supabase
        .from("category")
        .select("category_id")
        .ilike("name", `%${query}%`);
      const categoryIds = categories?.map(c => c.category_id) || [];

      //find IDs of recipes that have those categories
      let recipeIdsByCategory = [];
      if (categoryIds.length > 0) {
        const { data: recipeCategories } = await supabase
          .from("recipe_category")
          .select("recipe_id")
          .in("category_id", categoryIds);
        recipeIdsByCategory = recipeCategories?.map(rc => rc.recipe_id) || [];
      }

      //search dietary tags table using recipe id
      const { data: tagRecipes } = await supabase
        .from("recipe_dietary_tags")
        .select("recipe_id")
        .ilike("dietary_tag", `%${query}%`);
      const recipeIdsByTag = tagRecipes?.map(rt => rt.recipe_id) || [];

      //combine and remove any duplicate recipe IDs
      const combinedRecipeIds = Array.from(new Set([
        ...recipeIdsByIngredient,
        ...recipeIdsByTag,
        ...recipeIdsByCategory,
      ]));

      //create a supabase 'or' query to fetch matching recipes
      let orQuery = `title.ilike.%${query}%,instructions.ilike.%${query}%`;
      if (combinedRecipeIds.length > 0) {
        orQuery += `,recipe_id.in.(${combinedRecipeIds.join(",")})`;
      }

      //get all search results that match the query
      const { data, error } = await supabase
        .from("recipe")
        .select("*")
        .or(orQuery)
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

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8); // Load 8 more each time
  };

  return (
    <div className={styles.pageContainer}>
       <div className={styles.headerContainer}>
            <h1 className={styles.searchHeader}>Search Results for</h1>
            <div className={styles.searchResultContainer}>
              <h5 className={styles.searchResult}>{ query }</h5>
              <hr />
            </div>
        </div>
      {/* <SearchResultsHeader /> */}
      {/* <SearchFilters/> */}
      <div className={styles.results}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : recipes.length === 0 ? (
          <div className={styles.noResults}>No recipes found :&#40;</div>
        ) : (
          recipes.slice(0, visibleCount).map((recipe) => (
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          ))
        )}
      </div>
      {visibleCount < recipes.length && (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;