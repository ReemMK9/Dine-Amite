const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const recipeData = require('./message.json'); // Load JSON file

// 🔹 Replace with your actual Supabase project URL and API key
const SUPABASE_URL = 'https://kxeogsfnfwlncyachcxm.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZW9nc2ZuZndsbmN5YWNoY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ0MTcsImV4cCI6MjA2MDU3MDQxN30.ZG5a-IUm9HTML0tFOXGG-DnBANips7T1DVniHyvetEs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function insertRecipe(recipe) {
  // 🔍 Check if the recipe already exists
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

  // 🔹 Determine difficulty based on preparation time
  let difficulty = "Unknown";
  if (recipe.readyInMinutes <= 15) difficulty = "Easy";
  else if (recipe.readyInMinutes <= 30) difficulty = "Medium";
  else difficulty = "Hard";

  // 🆕 Insert new recipe
  const { data, error } = await supabase.from('recipe').insert({
    recipe_id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    preparation_time: recipe.readyInMinutes,
    difficulty: difficulty, // 🔹 Now includes difficulty
    synced_at: new Date().toISOString(),
  });

  if (error) console.error('❌ Error inserting recipe:', error);
  else console.log('✅ Recipe inserted:', data);
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
    const { data, error } = await supabase.from('recipe_ingredient').upsert({
      recipe_id: recipe.id,
      ingredient_id: ingredient.id,
      amount: ingredient.amount,
      unit: ingredient.unit || null,
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

async function syncData() {
  await insertRecipe(recipeData);
  await insertIngredients(recipeData);
  await insertRecipeIngredients(recipeData);
  await insertDietaryTags(recipeData);
}

syncData();