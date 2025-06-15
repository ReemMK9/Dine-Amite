import React, { useEffect, useState } from "react";
import styles from "./NutritionFacts.module.css";
import supabase from "../../../config/supabaseClient";

// Conversion map: unit to grams
const unitToGrams = {
  g: 1,
  kg: 1000,
  mg: 0.001,
  lb: 453.592,
  oz: 28.3495,
  // Add more as needed
};

const NutritionFacts = ({ recipeId, servings }) => {
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

      // Calculate total nutrition for the whole recipe
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

      // Divide each nutrition value by servings to get per serving
      const servingsCount = servings && servings > 0 ? servings : 1;
      const perServingNutrition = {};
      for (const key in totalNutrition) {
        perServingNutrition[key] = totalNutrition[key] / servingsCount;
      }

      setNutrition(perServingNutrition);
    };

    fetchRecipeNutrition();
  }, [recipeId, servings]);

  if (!nutrition) return <p>Loading nutrition...</p>;

  // Friendly labels for nutrition keys
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
        <div className={styles.nutritionInfo}>
          {Object.entries(nutritionLabels).map(([key, label]) => (
            nutrition[key] !== undefined && (
              <React.Fragment key={key}>
                <p>
                  {label}: {Math.round(nutrition[key])}
                </p>
                <hr />
              </React.Fragment>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionFacts;