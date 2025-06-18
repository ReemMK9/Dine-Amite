import React, { useEffect, useState } from "react";
import styles from "./NutritionFacts.module.css";
import supabase from "../../../config/supabaseClient";


const nutritionFacts = ({ recipeId }) => {
  const [nutrition, setNutrition] = useState(null);

  useEffect(() => {
    const fetchRecipeNutrition = async () => {
      const { data, error } = await supabase
        .from("recipe_nutrition")
        .select(`
          calories, fat, saturated_fat, carbohydrates, sugar, cholesterol,
          sodium, protein, fiber
        `)
        .eq("recipe_id", recipeId)
        .single();

      if (error) {
        console.error("Error fetching nutrition:", error);
        return;
      }
      console.log("Nutrition data:", data);
      setNutrition(data);
    };

    fetchRecipeNutrition();
  }, [recipeId]);

  if (!nutrition) return <p>Loading nutrition...</p>;

  // relabelling for better readability
  const nutritionLabels = {
    calories: "Calories (Kcal)",
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
        <h2 className={styles.title}>Nutrition Facts </h2> <p className={styles.subtitle}>(Per Serving)</p>
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