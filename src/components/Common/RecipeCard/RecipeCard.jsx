import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeCard.module.css";
import supabase from "../../../config/supabaseClient";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (recipe?.recipe_id) {
      navigate(`/recipedetails/${recipe.recipe_id}`);
    }
  };

  const handleSaveRecipe = async (e) => {
    //prevent the click from navigating to recipe details
    e.stopPropagation(); 

    if (!recipe || !recipe.recipe_id) return;

    const {data: {user}} = await supabase.auth.getUser();
    const userId = user?.id;
    console.log("user id:", userId)
    if (!userId) {
      alert("Please log in to save recipes.");
      return;
    }

  try {
    //check if the user has a saved entry
    let { data: savedEntry, error: savedError } = await supabase
      .from("recipe_saved")
      .select("recipe_saved_id")
      .eq("user_id", userId)
      .single();

    if (savedError && savedError.code !== "PGRST116") {
      console.error("Error checking saved entry:", savedError.message);
      return;
    };

    //create saved entry if it doesn't exist
    if (!savedEntry) {
      const { data: newSaved, error: newSavedError } = await supabase
        .from("recipe_saved")
        .insert([{ user_id: userId }])
        .select("recipe_saved_id")
        .single();

      if (newSavedError) {
        console.error("Error creating saved entry:", newSavedError.message);
        return;
      }

      savedEntry = newSaved;
    };

    const { error } = await supabase
      .from("recipe_saved_items")
      .insert([{ recipe_saved_id: savedEntry.recipe_saved_id, recipe_id: recipe.recipe_id }]);

    if (error) {
      console.error("Error saving recipe:", error.message);
    } else {
      alert("Recipe saved successfully!");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};


  if (!recipe) return null;

  return (
    <div
      className={styles.recipeCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className={styles.recipeImage}>
        <img
          className={styles.recImage}
          src={recipe.image || "/placeholder.jpg"}
          alt={recipe.title || "Recipe"}
        />
        <button onClick={handleSaveRecipe} className={styles.saveButton}><i className="material-symbols-outlined">add_circle</i></button>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.recipeTitleContainer}>
          <h2 className={styles.recipeTitle}>{recipe.title}</h2>
        </div>
        <div className={styles.recipeDuration}>{recipe.ready_in}</div>
      </div>

    </div>
  );
};

export default RecipeCard;
