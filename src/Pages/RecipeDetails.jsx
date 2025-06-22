import React, { useEffect, useState } from "react";
import styles from "./RecipeDetails.module.css";
import Landing from "../components/recipeDetails/Landing";
import PrepInfo from "../components/recipeDetails/LeftSection/PrepInfo";
import Ingredients from "../components/recipeDetails/LeftSection/Ingredients";
import Instructions from "../components/recipeDetails/LeftSection/Instructions";
import NutritionFacts from "../components/recipeDetails/RightSection/NutritionFacts";
import SimilarRecipes from "../components/recipeDetails/RightSection/SimilarRecipes";
import Collections from "../components/Home/Collections";
import supabase from "../config/supabaseClient";
import { useParams } from "react-router-dom";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data } = await supabase
        .from("recipe")
        .select("*")
        .eq("recipe_id", id)
        .single();
      setRecipe(data);
    };

    const fetchIngredients = async () => {
      const { data } = await supabase
        .from("recipe_ingredient")
        .select(
          `
          amount,
          unit,
          ingredient:ingredient_id (name)
        `
        )
        .eq("recipe_id", id);
      if (data) setIngredients(data);
    };

    fetchRecipe();
    fetchIngredients();
  }, [id]);

  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.headContainer}>
        <div className={styles.recipeContainer}>
          <Landing recipe={recipe} />
          <PrepInfo recipe={recipe} />
        </div>
        <SimilarRecipes />        
      </div>
      {/* <div className={`container ${styles.mainContainer}`}> */}
        <div className={`row col-12 ${styles.recipeInfo}`}>
          <div className={`col-md-4 order-md-2 ${styles.nutritionFacts}`}>
            <NutritionFacts recipeId={id} />
          </div>
          <div className={`col-md-8 order-md-1 ml-0 ${styles.sectionSpacing}`}>
            <Ingredients ingredients={ingredients} />
            <Instructions summary={recipe.summary} steps={recipe.steps} />
          </div>
        </div>
      {/* </div> */}

      <Collections />
    </div>
  );
};

export default RecipeDetails;
