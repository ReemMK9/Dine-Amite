import React from "react";
import styles from "./Home.module.css"; 
import HeroSection from "../../components/Home/HeroSection"
import SliderCategories from "../../components/Home/SliderCategories";
import PopularCategories from "../../components/Home/PopularCategories";
import FullSubscriptionSection from "../../components/Common/Subscription/FullSubscriptionSection";
import Footer from "../../components/Common/Footer/Footer";
import Collections from "../../components/Home/Collections";
import supabase from "../../config/supabaseClient";
import { useState, useEffect } from "react";

const Home = () => {
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
    <div className={styles.container}>
      <HeroSection/>
      <SliderCategories recipes={recipes}/>
      <SliderCategories recipes={recipes}/>
      <PopularCategories/>
      {/* <FullSubscriptionSection/> */}
      <Collections/>
    </div>
    );
  };

export default Home;
