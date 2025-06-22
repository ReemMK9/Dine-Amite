import React, { useState, useEffect } from "react";
import styles from "./SearchFilters.module.css";
// import supabase from "../../config/supabaseClient";

const SearchFilters = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  

  const predefinedTabs = ["Ingredients", "Categories"];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const [ingredientRes, categoryRes, recipeRes] = await Promise.all([
        supabase.from("ingredient").select("*"),
        supabase.from("category").select("*"),
        supabase.from("recipe").select("*"),
      ]);

      if (ingredientRes.data) setIngredients(ingredientRes.data);
      if (categoryRes.data) setCategories(categoryRes.data);
      if (recipeRes.data) {
        setRecipes(recipeRes.data);
        setFilteredRecipes(recipeRes.data); // show all by default
      }
    };

    fetchData();
  }, []);

  // Filter logic
  useEffect(() => {
    if (selectedIngredients.length === 0 && selectedCategories.length === 0) {
      setFilteredRecipes(recipes);
      return;
    }

    const filter = recipes.filter((recipe) => {
      const matchesIngredients = selectedIngredients.length === 0 || selectedIngredients.every((ing) =>
        recipe.ingredients?.some((i) => i.name === ing)
      );

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(recipe.category);

      return matchesIngredients && matchesCategory;
    });

    setFilteredRecipes(filter);
  }, [selectedIngredients, selectedCategories, recipes]);

  const toggleSelection = (item, setter, selectedList) => {
    if (selectedList.includes(item)) {
      setter(selectedList.filter((val) => val !== item));
    } else {
      setter([...selectedList, item]);
    }
  };

  return (
    <div className={`container-fluid col-12 ${styles.container}`}>
      <div className="row col-12 justify-content-center">
        <div className="p-0">
          <div className={styles.mainContent}>
            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
              <div className="col-12">
                <div className="d-flex flex-nowrap overflow-auto gap-2 align-items-center">
                  <h5>Filter by:</h5>
                  {predefinedTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                      className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <hr className={styles.tabsHr} />
              </div>
            </div>

            {/* Dropdown Menus */}
            {activeTab === "Ingredients" && (
              <div className={styles.dropdownMenu}>
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className={`${styles.dropdownItem} ${selectedIngredients.includes(ing.name) ? styles.selected : ""}`}
                    onClick={() => toggleSelection(ing.name, setSelectedIngredients, selectedIngredients)}
                  >
                    {ing.name}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Categories" && (
              <div className={styles.dropdownMenu}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`${styles.dropdownItem} ${selectedCategories.includes(cat.name) ? styles.selected : ""}`}
                    onClick={() => toggleSelection(cat.name, setSelectedCategories, selectedCategories)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}

            {/* Filtered Recipes Display */}
            <div className={`row mt-4 ${styles.userProfItems}`}>
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <div className="col-md-4 mb-3" key={recipe.recipe_id}>
                    <div className="card">
                      <img
                        src={recipe.image}
                        className="card-img-top"
                        alt={recipe.title}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{recipe.title}</h5>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                (selectedIngredients.length > 0 || selectedCategories.length > 0) && (
                  <div className="col-12 text-center text-muted">No recipes found.</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
