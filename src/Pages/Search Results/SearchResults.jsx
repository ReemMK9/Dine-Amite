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

      const { data, error } = await supabase
        .from("recipe")
        .select("*") //need to update when categories are added
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

  return (
    <div className={styles.pageC}>
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
