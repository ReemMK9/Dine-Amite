import React from "react";
import styles from "./SearchResults.module.css";
import Navbar from "../../components/Common/Navbar/Navbar";
import Footer from "../../components/Common/Footer/Footer";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import SearchResultsHeader from "./SearchResultsHeader";

const SearchResults = () => {
  return (
    <div>
      <Navbar />
      <SearchResultsHeader />
      <div className={styles.results}>
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
