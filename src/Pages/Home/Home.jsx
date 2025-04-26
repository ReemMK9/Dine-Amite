import React from "react";
import styles from "./Home.module.css"; 
import HeroSection from "../../components/Home/HeroSection"
import SliderCategories from "../../components/Home/SliderCategories";
import PopularCategories from "../../components/Home/PopularCategories";
import FullSubscriptionSection from "../../components/Common/Subscription/FullSubscriptionSection";
import Footer from "../../components/Common/Footer/Footer";
import Collections from "../../components/Home/Collections";

const Home = () => {
  return <div>
    <HeroSection/>
    <SliderCategories/>
    <SliderCategories/>
    <PopularCategories/>
    <FullSubscriptionSection/>
    <Collections/>
    <Footer/>
  </div>;
};

export default Home;
