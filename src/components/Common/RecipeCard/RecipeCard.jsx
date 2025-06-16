import React from "react";
import styles from "./RecipeCard.module.css";
import supabase from "../../../config/supabaseClient";


const RecipeCard = ({ recipe }) => {
  return (
    <div className={styles.recipeCard}>
      <div className={styles.recipeImage}>
         <img className={styles.recImage} src={recipe.image} alt={recipe.title} />
      </div>
      <h2 className={styles.recipeTitle}> {recipe.title} </h2>
      <div className={styles.recipeDuration}> {recipe.ready_in} </div>
    </div>
    );
};
    


export default RecipeCard;

//  <div className={styles.recipeCard}>
//       {error && (<p className={styles.error}>{error}</p>)}
//       {recipes && (
//         <div className={styles.recipes}>
//           {recipes.map(recipe => (
//             <div className={styles.recipeCard} key={recipe.recipe_id}>
//             <div className={styles.recipeImage}>
//               <img src={recipe.image} alt={recipe.title} />
//             </div>
//               <h2 className={styles.recipeTitle}>{recipe.title}</h2>
//             <div className={styles.recipeDuration}>
//                 {recipe.ready_in} minutes
//             </div>
//           </div>
//           ))}
//         </div>
//       )}
//     </div>