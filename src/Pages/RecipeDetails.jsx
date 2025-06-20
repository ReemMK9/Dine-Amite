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
    <>
      <div className={styles.headContainer}>
        <Landing recipe={recipe} />
        <SimilarRecipes />
      </div>
      <div className={`container ${styles.mainContainer}`}>
        <div className="row col-12">
          {/* 1. Prep Info */}
          <div className="col-12">
            <PrepInfo recipe={recipe} />
          </div>

          {/* 2. Nutrition facts — on the right on large screens, before Ingredients on mobile */}
          <div className="col-md-4 order-md-2">
            <NutritionFacts recipeId={id} />
          </div>

          {/* 3. Ingredients + Instructions */}
          <div className={`col-md-8 order-md-1 ml-0 ${styles.sectionSpacing}`}>
            <Ingredients ingredients={ingredients} />
            <Instructions summary={recipe.summary} steps={recipe.steps} />
          </div>

          {/* 4. Similar recipes — right below nutrition facts on large screens, but after Instructions on small */}
          <div
            className="col-md-4 offset-md-8 order-md-3"
          >
            <SimilarRecipes />
          </div>
        </div>
      </div>

      {/* 5. Collections */}
      <Collections />
    </>
  );
};

export default RecipeDetails;
