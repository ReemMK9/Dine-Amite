const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const recipeData = require('./message.json'); // Load JSON file

// 🔹 Replace with your actual Supabase project URL and API key
const SUPABASE_URL = 'https://kxeogsfnfwlncyachcxm.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZW9nc2ZuZndsbmN5YWNoY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ0MTcsImV4cCI6MjA2MDU3MDQxN30.ZG5a-IUm9HTML0tFOXGG-DnBANips7T1DVniHyvetEs';
const SPOONACULAR_KEY = 'e3c9e8915f1942cc8d0547bef1c355ff'; // Store API key in .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchIngredientDetails(ingredientId) {
  const url = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=1&apiKey=${SPOONACULAR_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ingredient ${ingredientId}`);
    
    const ingredientData = await response.json();
    return ingredientData;
  } catch (error) {
    console.error(`❌ Error fetching ingredient ${ingredientId}:`, error);
    return null;
  }
}

const SPOONACULAR_IMAGE_URL = "https://img.spoonacular.com/ingredients_100x100/";

async function insertIngredient(ingredientData) {
  if (!ingredientData) {
    console.error("❌ No ingredient data received.");
    return;
  }

  console.log(`🛠️ Updating ingredient: ${ingredientData.name}`);

  const nutrients = ingredientData.nutrition?.nutrients.reduce((acc, nutrient) => {
    acc[nutrient.name.toLowerCase().replace(/\s/g, '_')] = Math.round(nutrient.amount);
    return acc;
  }, {});

  const { data, error } = await supabase.from('ingredient').upsert({
    ingredient_id: ingredientData.id,
    name: ingredientData.name,
    image: ingredientData.image ? `${SPOONACULAR_IMAGE_URL}${ingredientData.image}` : null, // 🔹 Append base URL
    calories: nutrients.calories || null,
    fat: nutrients.fat || null,
    saturated_fat: nutrients.saturated_fat || null,
    carbohydrates: nutrients.carbohydrates || null,
    sugar: nutrients.sugar || null,
    cholesterol: nutrients.cholesterol || null,
    sodium: nutrients.sodium || null,
    protein: nutrients.protein || null,
    fiber: nutrients.fiber || null,
    calcium: nutrients.calcium || null,
    synced_at: new Date().toISOString(),
  });

  if (error) console.error(`❌ Supabase Insert Error:`, error);
  else console.log(`✅ Ingredient updated: ${ingredientData.name}`);
}

async function updateAllIngredients() {
  // 🔍 Fetch all ingredient IDs from Supabase
  const { data: ingredients, error } = await supabase.from('ingredient').select('ingredient_id');

  if (error) {
    console.error("❌ Error fetching ingredient IDs:", error);
    return;
  }

  console.log(`🔄 Updating ${ingredients.length} ingredients...`);

  for (const ingredient of ingredients) {
    const ingredientData = await fetchIngredientDetails(ingredient.ingredient_id);
    await insertIngredient(ingredientData);
  }

  console.log("✅ All ingredients updated!");
}

// 🔄 Run the update process for all ingredients
updateAllIngredients();