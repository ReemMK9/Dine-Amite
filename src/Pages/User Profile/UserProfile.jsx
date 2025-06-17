import React from "react";
import styles from "./UserProfile.module.css";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


const UserProfile = () => {
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
        const { data, error } = await supabase
          .from('recipe')
          .select('*')

          if (error) {
            setError('Could not fetch recipes');
            setRecipes(null);
            console.log(error);
          }
          if (data) {
            setRecipes(data);
            setError(null);
          }
    }

    fetchRecipes(); 
  }, []);



    console.log(supabase);

  return (
    <>
      <h1>'s Recipe Book</h1>
      <div className={styles.infoBox}>
        <div className={styles.userProfPic}>
          <div className={styles.userimg}></div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userBio}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, molestias. Explicabo delectus nulla illum eius nemo ab labore nostrum totam omnis cumque officia veritatis tempora, quam facilis corporis nobis quibusdam.</div>
          <div className={styles.userSocials}>
            <span>1000+ subscribers</span>
            <button>Share</button>
          </div>
        </div>
      </div>
      <div className={styles.userProfileTabs}>
        <button>Saved Recipes</button>
        <button>Favorites</button>
        <button>Collection Name</button>
        <button>Collection Name</button>
        <button>History</button>
        <hr />
      </div>
      <div className={styles.userProfItems}>
        {recipes && recipes.slice(0,6).map((recipe) => (
            <RecipeCard key={recipe.recipe_id} recipe={recipe} />
          ))}
      </div>
    </>
  );
};

export default UserProfile;
