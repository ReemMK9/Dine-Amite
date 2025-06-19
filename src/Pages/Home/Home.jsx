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

        // Filter categories that have at least 4 recipes
        const categoriesWithEnoughRecipes = [];
        
        for (const category of categories) {
          const { data: recipeCategories, error: recipeCatError } = await supabase
            .from('recipe_category')
            .select('recipe_id')
            .eq('category_id', category.category_id);

          if (!recipeCatError && recipeCategories && recipeCategories.length >= 4) {
            categoriesWithEnoughRecipes.push({
              ...category,
              totalRecipes: recipeCategories.length
            });
          }
        }

        if (categoriesWithEnoughRecipes.length === 0) {
          setError('No categories found with enough recipes');
          return;
        }

        // Randomly select 2 categories from those with enough recipes
        const shuffledCategories = categoriesWithEnoughRecipes.sort(() => 0.5 - Math.random());
        const selectedCategories = shuffledCategories.slice(0, 2);

        // Fetch recipes for each selected category
        const categoryWithRecipes = await Promise.all(
          selectedCategories.map(async (category) => {
            const { data: recipeCategories, error: recipeCatError } = await supabase
              .from('recipe_category')
              .select('recipe_id')
              .eq('category_id', category.category_id)
              .limit(20); // Get more recipes to choose from

            if (recipeCatError) {
              console.log('Error fetching recipe categories:', recipeCatError);
              return { ...category, recipes: [] };
            }

            if (!recipeCategories || recipeCategories.length === 0) {
              return { ...category, recipes: [] };
            }

            // Get recipe IDs and fetch full recipe data
            const recipeIds = recipeCategories.map(rc => rc.recipe_id);
            const { data: recipes, error: recipeError } = await supabase
              .from('recipe')
              .select('*')
              .in('recipe_id', recipeIds);

            if (recipeError) {
              console.log('Error fetching recipes:', recipeError);
              return { ...category, recipes: [] };
            }

            // Randomly select 4 recipes from this category
            const shuffledRecipes = recipes ? recipes.sort(() => 0.5 - Math.random()) : [];
            const selectedRecipes = shuffledRecipes.slice(0, 4);

            return {
              ...category,
              recipes: selectedRecipes
            };
          })
        );

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