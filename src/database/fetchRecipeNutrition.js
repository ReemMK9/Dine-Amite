const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const SUPABASE_URL = 'https://kxeogsfnfwlncyachcxm.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZW9nc2ZuZndsbmN5YWNoY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ0MTcsImV4cCI6MjA2MDU3MDQxN30.ZG5a-IUm9HTML0tFOXGG-DnBANips7T1DVniHyvetEs';
const SPOONACULAR_KEY = 'e6c5f053d1d04f9ca91f75dd6c4d341f'; // Store API key in .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchRecipeNutrition(recipeId) {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${SPOONACULAR_KEY}`;

  console.log(`🔍 Fetching nutrition for recipe: ${recipeId}`);
  console.log(`📡 API Request: ${url}`);

  try {
    const response = await fetch(url);
    console.log(`🔍 Response Status for ${recipeId}: ${response.status}`);

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`❌ API Error for ${recipeId}:`, responseText);
      throw new Error(`Failed to fetch nutrition for recipe ${recipeId}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched nutrition for recipe ${recipeId}`);

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
      fiber: extractNutrient(data.nutrients, "Fiber"), // 🔹 Added Fiber Extraction
      glycemic_index: extractProperty(data.properties, "Glycemic Index"),
      glycemic_load: extractProperty(data.properties, "Glycemic Load"),
      nutrition_score: extractProperty(data.properties, "Nutrition Score"),
      percent_protein: data.caloricBreakdown?.percentProtein || 0,
      percent_fat: data.caloricBreakdown?.percentFat || 0,
      percent_carbs: data.caloricBreakdown?.percentCarbs || 0,
      weight_per_serving: data.weightPerServing?.amount || 0,
      synced_at: new Date().toISOString(),
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
    console.error(`❌ Error updating nutrition for recipe ${recipeId}:`, error);
  } else {
    console.log(`✅ Nutrition updated for recipe ${recipeId}`);
  }
}

async function updateAllRecipeNutrition() {
  const { data: recipes, error: fetchError } = await supabase.from("recipe").select("recipe_id");

  if (fetchError) {
    console.error("❌ Error fetching recipes:", fetchError);
    return;
  }

  console.log(`🔄 Processing ${recipes.length} recipes for nutrition data...`);

  for (const recipe of recipes) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate-limit handling
    const nutritionData = await fetchRecipeNutrition(recipe.recipe_id);
    await insertRecipeNutrition(recipe.recipe_id, nutritionData);
  }

  console.log("✅ All recipe nutrition data populated!");
}

// 🔄 Run the update process
updateAllRecipeNutrition();