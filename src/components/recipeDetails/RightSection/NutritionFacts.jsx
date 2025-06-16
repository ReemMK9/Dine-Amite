import React, { useEffect, useState } from "react";
import styles from "./NutritionFacts.module.css";
import supabase from "../../../config/supabaseClient";

// conversion map: unit to grams
const unitToGrams = {
  g: 1,
  kg: 1000,
  mg: 0.001,
  lb: 453.592,
  oz: 28.3495,
};

const nutritionFacts = ({ recipeId, servings }) => {
  const [nutrition, setNutrition] = useState(null);

  useEffect(() => {
    const fetchRecipeNutrition = async () => {
      const { data, error } = await supabase
        .from("recipe_ingredient")
        .select(`
          amount,
          unit,
          ingredient (
            calories, fat, saturated_fat, carbohydrates, sugar, cholesterol,
            sodium, protein, fiber, calcium
          )
        `)
        .eq("recipe_id", recipeId);

      if (error) {
        console.error("Error fetching nutrition:", error);
        return;
      }

      // calculate total nutrition for the whole recipe
      const totalNutrition = data.reduce((total, { amount, unit, ingredient }) => {
        let amountInGrams = amount;
        if (unitToGrams[unit]) {
          amountInGrams = amount * unitToGrams[unit];
        }
        for (const key in ingredient) {
          total[key] = (total[key] || 0) + (ingredient[key] || 0) * amountInGrams;
        }
        return total;
      }, {});

      // checks if servings is valid and greater than 0
      const servingsCount = servings && servings > 0 ? servings : 1;

      // calculate per serving nutrition
      const perServingNutrition = {};
      for (const key in totalNutrition) {
        perServingNutrition[key] = totalNutrition[key] / servingsCount;
      }

      setNutrition(perServingNutrition);
    };

    fetchRecipeNutrition();
  }, [recipeId, servings]);

  if (!nutrition) return <p>Loading nutrition...</p>;

  // relabelling for better readability
  const nutritionLabels = {
    calories: "Calories",
    fat: "Fat (g)",
    saturated_fat: "Saturated Fat (g)",
    carbohydrates: "Carbohydrates (g)",
    sugar: "Sugar (g)",
    cholesterol: "Cholesterol (mg)",
    sodium: "Sodium (mg)",
    protein: "Protein (g)",
    fiber: "Fiber (g)",
    calcium: "Calcium (mg)",
  };


  return (
    <div className={styles.container}>
      <div className={styles.nutritionFacts}>
        <h2 className={styles.title}>Nutrition Facts (per serving)</h2>
        <hr/>
        <div className={styles.nutritionInfo}>
          {Object.entries(nutritionLabels).map(([key, label]) => (
            nutrition[key] !== undefined && (
              <div key={key}>
                <p className={styles.nutritionText}>{label}: {Math.round(nutrition[key])}</p>
                <hr />
              </div>
            ) 
          ))}
        </div>
      </div>
    </div>
  );
};

export default nutritionFacts;