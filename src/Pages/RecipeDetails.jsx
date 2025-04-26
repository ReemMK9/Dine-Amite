import React from "react";
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

const RecipeDetails = () => {
  return (
    <>
      <Landing />
      <div className={styles.mainContainer}>
        <div className={styles.leftSection}>
          <PrepInfo />
          <Ingredients />
          <Instructions />
        </div>
        <div className={styles.rightSection}>
          <NutritionFacts />
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
