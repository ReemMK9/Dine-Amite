const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://kxeogsfnfwlncyachcxm.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZW9nc2ZuZndsbmN5YWNoY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ0MTcsImV4cCI6MjA2MDU3MDQxN30.ZG5a-IUm9HTML0tFOXGG-DnBANips7T1DVniHyvetEs';
const SPOONACULAR_KEY = 'd54f095c7b9f42d587e4bb14e3166e20'; // Store API key in .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Check if recipe already has a nutrition record
async function hasNutrition(recipeId) {
  const { data, error } = await supabase
    .from('recipe_nutrition')
    .select('recipe_id')
    .eq('recipe_id', recipeId)
    .maybeSingle();

  if (error) {
    console.error(`❌ Error checking nutrition for recipe ${recipeId}:`, error.message);
    return false;
  }

  return !!data;
}

async function fetchRecipeNutrition(recipeId) {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${SPOONACULAR_KEY}`;

  console.log(`📡 Requesting nutrition for recipe ${recipeId}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ API Error for ${recipeId}: ${text}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Fetched nutrition for recipe ${recipeId}`);

    return {
      calories: extractNutrient(data.nutrients, "Calories"),
      fat: extractNutrient(data.nutrients, "Fat"),
      saturated_fat: extractNutrient(data.nutrients, "Saturated Fat"),
      carbohydrates: extractNutrient(data.nutrients, "Carbohydrates"),
      net_carbohydrates: extractNutrient(data.nutrients, "Net Carbohydrates"),
      sugar: extractNutrient(data.nutrients, "Sugar"),
      cholesterol: extractNutrient(data.nutrients, "Cholesterol"),
      sodium: extractNutrient(data.nutrients, "Sodium"),
      protein: extractNutrient(data.nutrients, "Protein"),
      fiber: extractNutrient(data.nutrients, "Fiber"),
      glycemic_index: extractProperty(data.properties, "Glycemic Index"),
      glycemic_load: extractProperty(data.properties, "Glycemic Load"),
      nutrition_score: extractProperty(data.properties, "Nutrition Score"),
      percent_protein: data.caloricBreakdown?.percentProtein || 0,
      percent_fat: data.caloricBreakdown?.percentFat || 0,
      percent_carbs: data.caloricBreakdown?.percentCarbs || 0,
      weight_per_serving: data.weightPerServing?.amount || 0,
      synced_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Error fetching nutrition for recipe ${recipeId}:`, error);
    return null;
  }
}

function extractNutrient(nutrients, name) {
  return nutrients.find((n) => n.name === name)?.amount || 0;
}

function extractProperty(properties, name) {
  return properties.find((p) => p.name === name)?.amount || 0;
}

async function insertRecipeNutrition(recipeId, nutritionData) {
  if (!nutritionData) return;

  const { error } = await supabase
    .from("recipe_nutrition")
    .upsert({ recipe_id: recipeId, ...nutritionData });

  if (error) {
    console.error(`❌ Supabase error inserting nutrition for ${recipeId}:`, error);
  } else {
    console.log(`✅ Nutrition saved for recipe ${recipeId}`);
  }
}

async function updateAllRecipeNutrition() {
  const { data: recipes, error } = await supabase.from("recipe").select("recipe_id");

  if (error) {
    console.error("❌ Error fetching recipes:", error);
    return;
  }

  console.log(`🔄 Processing ${recipes.length} recipes for nutrition...`);

  for (const recipe of recipes) {
    const exists = await hasNutrition(recipe.recipe_id);
    if (exists) {
      console.log(`⏭️ Skipping recipe ${recipe.recipe_id} — already has nutrition.`);
      continue;
    }

    await new Promise((r) => setTimeout(r, 1000)); // rate limit
    const nutritionData = await fetchRecipeNutrition(recipe.recipe_id);
    await insertRecipeNutrition(recipe.recipe_id, nutritionData);
  }

  console.log("✅ Nutrition sync complete.");
}

// 🔁 Start the script
updateAllRecipeNutrition();