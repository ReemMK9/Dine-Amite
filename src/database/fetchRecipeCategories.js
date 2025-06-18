const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const SUPABASE_URL = 'https://kxeogsfnfwlncyachcxm.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZW9nc2ZuZndsbmN5YWNoY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ0MTcsImV4cCI6MjA2MDU3MDQxN30.ZG5a-IUm9HTML0tFOXGG-DnBANips7T1DVniHyvetEs';
const SPOONACULAR_KEY = 'e6c5f053d1d04f9ca91f75dd6c4d341f'; // Store API key in .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchRecipeDetails(recipeId) {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${SPOONACULAR_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch recipe ${recipeId}`);

    const recipeData = await response.json();
    return recipeData.dishTypes || [];
  } catch (error) {
    console.error(`❌ Error fetching recipe ${recipeId}:`, error);
    return [];
  }
}

async function insertRecipeCategories(recipeId, dishTypes) {
  for (const type of dishTypes) {
    let { data: categoryData, error: categoryError } = await supabase
      .from("category")
      .select("category_id")
      .eq("name", type)
      .single();

    if (!categoryData) {
      const { data: newCategory, error: insertError } = await supabase
        .from("category")
        .insert([{ name: type }])
        .select("category_id")
        .single();

      if (insertError) {
        console.error(`❌ Error inserting category ${type}:`, insertError);
        continue;
      }

      categoryData = newCategory;
    }

    // 🔍 Check if the recipe-category pair already exists
    const { data: exists, error: existsError } = await supabase
      .from("recipe_category")
      .select("recipe_id")
      .eq("recipe_id", recipeId)
      .eq("category_id", categoryData.category_id)
      .maybeSingle();

    if (exists) {
      console.log(`⚠️ Recipe ${recipeId} already linked to category ${type}. Skipping...`);
      continue;
    }

    const { error: linkError } = await supabase
      .from("recipe_category")
      .insert([{ recipe_id: recipeId, category_id: categoryData.category_id }]);

    if (linkError) {
      console.error(`❌ Error linking recipe ${recipeId} to category ${type}:`, linkError);
    } else {
      console.log(`✅ Linked recipe ${recipeId} to category ${type}`);
    }
  }
}

async function updateAllRecipeCategories() {
  const { data: recipes, error: fetchError } = await supabase.from("recipe").select("recipe_id");

  if (fetchError) {
    console.error("❌ Error fetching recipes:", fetchError);
    return;
  }

  console.log(`🔄 Processing ${recipes.length} recipes...`);

  for (const recipe of recipes) {
    const dishTypes = await fetchRecipeDetails(recipe.recipe_id);
    if (dishTypes.length > 0) {
      await insertRecipeCategories(recipe.recipe_id, dishTypes);
    }
  }

  console.log("✅ All recipe categories populated!");
}

// 🔄 Run the update process
updateAllRecipeCategories();