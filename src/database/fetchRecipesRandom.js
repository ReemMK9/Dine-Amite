const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const SUPABASE_URL = 'https://kxeogsfnfwlncyachcxm.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZW9nc2ZuZndsbmN5YWNoY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ0MTcsImV4cCI6MjA2MDU3MDQxN30.ZG5a-IUm9HTML0tFOXGG-DnBANips7T1DVniHyvetEs';
const SPOONACULAR_KEY = '89035776f6114b1bb319dc1f93a24933'; // Store API key in .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchRandomRecipes() {
  const url = `https://api.spoonacular.com/recipes/random?number=5&apiKey=${SPOONACULAR_KEY}`;

  console.log(`🔍 Fetching random recipes from: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch recipes: ${response.statusText}`);

    const data = await response.json();

    // 🔹 Save response to a JSON file
    fs.writeFileSync('recipes.json', JSON.stringify(data.recipes, null, 2));

    console.log("✅ Recipes saved to recipes.json");

    return data.recipes || []; // Ensure we return an array
  } catch (error) {
    console.error(`❌ Error fetching recipes:`, error);
    return [];
  }
}

async function insertRecipe(recipe) {
  const { data: existingRecipe, error: fetchError } = await supabase
    .from('recipe')
    .select('recipe_id')
    .eq('recipe_id', recipe.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('❌ Error checking recipe existence:', fetchError);
    return;
  }

  if (existingRecipe) {
    console.log(`⚠️ Recipe already exists: ${recipe.title}, skipping insert.`);
    return;
  }

  // 🔹 Ensure preparation_time and cooking_time are correctly extracted
  const preparationTime = recipe.preparationMinutes || (recipe.readyInMinutes - recipe.cookingMinutes) || null;
  const cookingTime = recipe.cookingMinutes || (recipe.readyInMinutes - preparationTime) || null;
  const readyIn = recipe.readyInMinutes || null;

  const { data, error } = await supabase.from('recipe').insert({
    recipe_id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    preparation_time: preparationTime,
    cooking_time: cookingTime,
    ready_in: readyIn,
    servings: recipe.servings || null,
    summary: recipe.summary || null,
    instructions: recipe.instructions || null,
    steps: JSON.stringify(recipe.analyzedInstructions) || null,
    synced_at: new Date().toISOString(),
  });

  if (error) console.error('❌ Error inserting recipe:', error);
  else console.log(`✅ Recipe inserted: ${recipe.title}`);
}

async function insertIngredients(recipe) {
  for (const ingredient of recipe.extendedIngredients) {
    const { data, error } = await supabase.from('ingredient').upsert({
      ingredient_id: ingredient.id,
      name: ingredient.name,
      synced_at: new Date().toISOString(),
    });

    if (error) console.error(`❌ Error inserting ingredient (${ingredient.name}):`, error);
    else console.log(`✅ Ingredient inserted/updated: ${ingredient.name}`);
  }
}

async function insertRecipeIngredients(recipe) {
  for (const ingredient of recipe.extendedIngredients) {
    const unit = ingredient.unit ? ingredient.unit.substring(0, 20) : null; // 🔹 Truncate to 20 characters

    const { data, error } = await supabase.from('recipe_ingredient').upsert({
      recipe_id: recipe.id,
      ingredient_id: ingredient.id,
      amount: ingredient.amount,
      unit: unit,
    });

    if (error) console.error(`❌ Error linking ingredient (${ingredient.name}) to recipe:`, error);
    else console.log(`✅ Linked ingredient: ${ingredient.name} to recipe: ${recipe.title}`);
  }
}

async function insertDietaryTags(recipe) {
  const dietaryTags = [];

  if (recipe.vegan) dietaryTags.push("vegan");
  if (recipe.vegetarian) dietaryTags.push("vegetarian");
  if (recipe.glutenFree) dietaryTags.push("gluten-free");
  if (recipe.ketogenic) dietaryTags.push("ketogenic");
  if (recipe.dairyFree) dietaryTags.push("dairy-free");
  if (recipe.lowFodmap) dietaryTags.push("low-fodmap");
  if (recipe.whole30) dietaryTags.push("whole30");

  for (const tag of dietaryTags) {
    const { data, error } = await supabase.from('recipe_dietary_tags').upsert({
      recipe_id: recipe.id,
      dietary_tag: tag,
    });

    if (error) console.error(`❌ Error inserting dietary tag (${tag}) for recipe:`, error);
    else console.log(`✅ Dietary tag inserted/updated: ${tag} for recipe: ${recipe.title}`);
  }
}

async function storeRandomRecipes() {
  const recipes = await fetchRandomRecipes();
  console.log(`🔄 Processing ${recipes.length} random recipes...`);

  for (const recipe of recipes) {
    await insertRecipe(recipe);
    await insertIngredients(recipe);
    await insertRecipeIngredients(recipe);
    await insertDietaryTags(recipe);
  }

  console.log("✅ All random recipes stored in Supabase!");
}

// 🔄 Run the function
storeRandomRecipes();