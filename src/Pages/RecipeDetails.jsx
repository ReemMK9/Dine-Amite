import React, { useEffect, useState } from "react";
import styles from "./RecipeDetails.module.css";
import Landing from "../components/recipeDetails/Landing";
import PrepInfo from "../components/recipeDetails/LeftSection/PrepInfo";
import Ingredients from "../components/recipeDetails/LeftSection/Ingredients";
import Instructions from "../components/recipeDetails/LeftSection/Instructions";
import NutritionFacts from "../components/recipeDetails/RightSection/NutritionFacts";
import SimilarRecipes from "../components/recipeDetails/RightSection/SimilarRecipes";
import Feedback from "../components/recipeDetails/Feedback";
import PrevComments from "../components/recipeDetails/PrevComments";
import Collections from "../components/Home/Collections";
import supabase from "../config/supabaseClient";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("recipe")
        .select("*")
        .eq("recipe_id", id)
        .single();
      setRecipe(data);
    };

    const fetchIngredients = async () => {
      const { data, error } = await supabase
        .from("recipe_ingredient")
        .select(`
          amount,
          unit,
          ingredient:ingredient_id (name)
        `)
        .eq("recipe_id", id);

      if (data) {
        setIngredients(data);
      }
    };

    fetchIngredients();
    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <>
      <Landing recipe={recipe} />
      <div className={styles.mainContainer}>
        <div className={styles.leftSection}>
          <PrepInfo recipe={recipe} />
          <Ingredients ingredients={ingredients} />
          <Instructions summary={recipe.summary} steps={recipe.steps} />
        </div>
        <div className={styles.rightSection}>
          <NutritionFacts recipeId={id} servings={recipe.servings} />
          <SimilarRecipes />
        </div>
      </div>
      <Feedback />
      <PrevComments />
      <Collections />
    </>
  );
};

export default RecipeDetails;