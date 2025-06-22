import React from "react";
import styles from "./Home.module.css"; 
import HeroSection from "../../components/Home/HeroSection"
import SliderCategories from "../../components/Home/SliderCategories";
import PopularCategories from "../../components/Home/PopularCategories";
import FullSubscriptionSection from "../../components/Common/Subscription/FullSubscriptionSection";
import Footer from "../../components/Common/Footer/Footer";
import Collections from "../../components/Home/Collections";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";

const Home = () => {
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesWithRecipes = async () => {
    try {
      setLoading(true);

      // Fetch all categories
      const { data: categories, error: categoryError } = await supabase
        .from('category')
        .select('*');
      if (categoryError) {
        setError('Could not fetch categories');
        console.log(categoryError);
        return;
      }
      if (!categories || categories.length === 0) {
        setError('No categories found');
        return;
      }

      // Fetch all recipe_category rows
      const { data: recipeCategories, error: rcError } = await supabase
        .from('recipe_category')
        .select('recipe_id, category_id');
      if (rcError) {
        setError('Could not fetch recipe categories');
        console.log(rcError);
        return;
      }

      // Group recipe IDs by category
      const categoryToRecipeIds = {};
      recipeCategories.forEach(rc => {
        if (!categoryToRecipeIds[rc.category_id]) categoryToRecipeIds[rc.category_id] = [];
        categoryToRecipeIds[rc.category_id].push(rc.recipe_id);
      });

      // Filter categories with at least 4 recipes
      const categoriesWithEnoughRecipes = categories
        .map(cat => ({
          ...cat,
          recipeIds: categoryToRecipeIds[cat.category_id] || []
        }))
        .filter(cat => cat.recipeIds.length >= 4);

      if (categoriesWithEnoughRecipes.length === 0) {
        setError('No categories found with enough recipes');
        return;
      }

      // Randomly select 2 categories
      const shuffledCategories = categoriesWithEnoughRecipes.sort(() => 0.5 - Math.random());
      const selectedCategories = shuffledCategories.slice(0, 2);

      // Collect all needed recipe IDs 
      let allRecipeIds = [];
      const categoryRecipeMap = {};
      selectedCategories.forEach(cat => {
        const shuffled = cat.recipeIds.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        categoryRecipeMap[cat.category_id] = selected;
        allRecipeIds = allRecipeIds.concat(selected);
      });

      // Fetch all recipes in one query
      const { data: recipes, error: recipeError } = await supabase
        .from('recipe')
        .select('*')
        .in('recipe_id', allRecipeIds);
      if (recipeError) {
        setError('Could not fetch recipes');
        console.log(recipeError);
        return;
      }

      // Map recipes to their categories
      const recipeMap = {};
      recipes.forEach(r => { recipeMap[r.recipe_id] = r; });

      const categoryWithRecipes = selectedCategories.map(cat => ({
        ...cat,
        recipes: (categoryRecipeMap[cat.category_id] || []).map(id => recipeMap[id]).filter(Boolean)
      }));

      setCategoryData(categoryWithRecipes);
      setError(null);
    } catch (err) {
      setError('Could not fetch data');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      console.log(session ? "User is logged in" : "User is logged out");
    });
    
    console.log(supabase);
    fetchCategoriesWithRecipes(); 
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <HeroSection/>
        <div className="container">
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <HeroSection/>
        <div className="container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HeroSection/>
      {categoryData.map((category, index) => (
        <SliderCategories 
          key={`${category.category_id}-${index}`}
          category={category}
          recipes={category.recipes}
        />
      ))}
      <PopularCategories/>
      {/* <FullSubscriptionSection/> */}
      <Collections/>
    </div>
  );
};

export default Home;