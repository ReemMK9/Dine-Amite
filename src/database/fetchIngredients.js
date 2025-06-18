const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const SUPABASE_URL = 'https://kxeogsfnfwlncyachcxm.supabase.co/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZW9nc2ZuZndsbmN5YWNoY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ0MTcsImV4cCI6MjA2MDU3MDQxN30.ZG5a-IUm9HTML0tFOXGG-DnBANips7T1DVniHyvetEs';
const SPOONACULAR_KEY = '660953067a554b56b32cab6f548213a2'; // Store API key in .env

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchIngredientDetails(ingredientId) {
  const url = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=1&apiKey=${SPOONACULAR_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ingredient ${ingredientId}`);

    const ingredientData = await response.json();

    return {
      id: ingredientData.id,
      name: ingredientData.originalName || ingredientData.name,
      name_alt: ingredientData.name
    };
  } catch (error) {
    console.error(`❌ Error fetching ingredient ${ingredientId}:`, error.message);
    return null;
  }
}

async function updateIngredientNames(ingredient) {
  if (ingredient.name && ingredient.name_alt) {
    console.log(`⏭️ Skipping ${ingredient.ingredient_id} — already has name and name_alt.`);
    return;
  }

  const ingredientData = await fetchIngredientDetails(ingredient.ingredient_id);
  if (!ingredientData) return;

  console.log(`🛠️ Updating ${ingredient.ingredient_id} → name: "${ingredientData.name}", name_alt: "${ingredientData.name_alt}"`);

  const { error } = await supabase.from('ingredient').update({
    name: ingredientData.name,
    name_alt: ingredientData.name_alt
  }).eq('ingredient_id', ingredient.ingredient_id);

  if (error) {
    console.error(`❌ Supabase Update Error for ID ${ingredient.ingredient_id}:`, error);
  } else {
    console.log(`✅ Updated ingredient ${ingredient.ingredient_id}`);
  }
}

async function updateAllIngredientNames() {
  const { data: ingredients, error } = await supabase
    .from('ingredient')
    .select('ingredient_id, name, name_alt');

  if (error) {
    console.error('❌ Error fetching ingredients:', error);
    return;
  }

  console.log(`🔄 Checking ${ingredients.length} ingredients...`);

  for (const ingredient of ingredients) {
    await updateIngredientNames(ingredient);
    await new Promise(resolve => setTimeout(resolve, 1000)); // prevent API rate limit issues
  }

  console.log('✅ Done updating ingredient names!');
}

updateAllIngredientNames();