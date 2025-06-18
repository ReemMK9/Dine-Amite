import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import supabase from "../../config/supabaseClient";
import GroceryList from "../../components/UserProfiles/GroceryList";

const UserProfile = () => {
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("Saved Recipes");
  const [customTabs, setCustomTabs] = useState([]);
  const [addingTab, setAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState("");

  const predefinedTabs = [
    "Saved Recipes",
    "Favorites",
    "Grocery Lists",
    "History",
  ];

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase.from("recipe").select("*");
      if (error) {
        setError("Could not fetch recipes");
        setRecipes(null);
        console.log(error);
      }
      if (data) {
        setRecipes(data);
        setError(null);
      }
    };

    fetchRecipes();
  }, []);

  const handleNewTabSubmit = (e) => {
    e.preventDefault();
    if (!newTabName.trim()) return;
    setCustomTabs((prev) => [...prev, newTabName.trim()]);
    setNewTabName("");
    setAddingTab(false);
  };

  const handleDeleteCustomTab = (index) => {
    setCustomTabs((prev) => prev.filter((_, i) => i !== index));
    if (activeTab === customTabs[index]) {
      setActiveTab("Saved Recipes");
    }
  };

  return (
    <div className="container-fluid col-12">
      <div className="row justify-content-center">
        <div className="col-10 mt-4">
          <h1>'s Recipe Book</h1>

          {/* Profile Info Section */}
          <div
            className={`row col-10
           ${styles.infoBox}`}
          >
            <div className={`col-12 col-md-4 d-flex justify-content-center ${styles.userImgContainer}`}>
              <div className={styles.userimg}></div>
            </div>
            <div className="col-12 col-md-8">
              <div className={styles.userInfo}>
                <div className={styles.userBio}>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit...
                </div>
                <div className={styles.userSocials}>
                  <button onClick={handleShare}>Share</button>
                  {copied && <span className="ms-2 text-success">Copied!</span>}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.mainContent}>
            {/* Tabs */}
            <div className={styles.userProfileTabs}>
              <div className="col-12 ">
                <div className="d-flex flex-nowrap overflow-auto gap-2 align-items-center">
                  {/* Add New Tab Button (Always on far left) */}
                  <button
                    className={`${styles.tabButton} ${styles.addTabButton}`}
                    onClick={() => setAddingTab(true)}
                    disabled={addingTab}
                    style={{ backgroundColor: "#eee", color: "#444" }}
                  >
                    ➕
                  </button>

                  {/* Predefined Tabs */}
                  {predefinedTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${styles.tabButton} ${
                        activeTab === tab ? styles.activeTab : ""
                      }`}
                    >
                      {tab}
                    </button>
                  ))}

                  {/* Custom Tabs - placed at the end */}
                  {customTabs.map((tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${styles.tabButton} ${
                        activeTab === tab ? styles.activeTab : ""
                      }`}
                    >
                      {tab}
                      <span
                        className={styles.deleteTabBtn}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent switching tab when deleting
                          handleDeleteCustomTab(index);
                        }}
                      >
                        ❌
                      </span>
                    </button>
                  ))}

                  {/* Input field appears exactly where new tab will be inserted */}
                  {addingTab && (
                    <form onSubmit={handleNewTabSubmit}>
                      <input
                        type="text"
                        autoFocus
                        className={styles.tabInput}
                        value={newTabName}
                        onChange={(e) => setNewTabName(e.target.value)}
                        onBlur={() => {
                          if (!newTabName.trim()) setAddingTab(false);
                        }}
                      />
                    </form>
                  )}
                </div>
              </div>
              <div className="col-12">
                <hr className={styles.tabsHr} />
              </div>
            </div>

            {/* Content Area */}
            <div className={`row ${styles.userProfItems}`}>
              <div className="col-12">
                {activeTab === "Saved Recipes" &&
                recipes &&
                recipes.length > 0 ? (
                  <div className="row">
                    {recipes.slice(0, 6).map((recipe) => (
                      <div
                        key={recipe.recipe_id}
                        className="col-12 col-sm-6 col-md-4 col-xl-3 d-flex mb-4"
                      >
                        <RecipeCard recipe={recipe} className="w-100" />
                      </div>
                    ))}
                  </div>
                ) : activeTab === "Grocery Lists" ? (
                  <GroceryList />
                ) : (
                  <div className="text-center text-muted mt-4">
                    No recipes here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
