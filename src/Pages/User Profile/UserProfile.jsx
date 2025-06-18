import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import supabase from "../../config/supabaseClient";

const UserProfile = () => {
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("Saved Recipes");

  const tabs = [
    "Saved Recipes",
    "Favorites",
    "Collection Name 1",
    "Collection Name 2",
    "History",
  ];

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // show "Copied!" for 2s
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

  return (
    <div className="container-fluid col-12">
      <div className="row justify-content-center">
        <div className="col-10">
          <h1>'s Recipe Book</h1>

          {/* Profile Info Section */}
          <div className={`row ${styles.infoBox}`}>
            <div className="col-12 col-md-4 d-flex justify-content-center">
              <div className={styles.userimg}></div>
            </div>
            <div className="col-12 col-md-8">
              <div className={styles.userInfo}>
                <div className={styles.userBio}>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nulla, molestias. Explicabo delectus nulla illum eius nemo ab
                  labore nostrum totam omnis cumque officia veritatis tempora,
                  quam facilis corporis nobis quibusdam.
                </div>
                <div className={styles.userSocials}>
                  {/* <span>1000+ subscribers</span> */}
                  <button onClick={handleShare}>Share</button>
                  {copied && <span className="ms-2 text-success">Copied!</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className={`row mt-4 ${styles.userProfileTabs}`}>
            <div className="col-12">
              <div className="d-flex flex-nowrap overflow-auto gap-2">
                {tabs.map((tab) => (
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
              </div>
            </div>
            <div className="col-12">
              <hr className={styles.tabsHr} />
            </div>
          </div>

          {/* Recipe Items Section */}
          <div className={`row ${styles.userProfItems}`}>
            {activeTab === "Saved Recipes" && recipes && recipes.length > 0 ? (
              recipes.slice(0, 6).map((recipe) => (
                <div
                  key={recipe.recipe_id}
                  className="col-12 col-sm-6 col-md-4 col-xl-3 d-flex mb-4"
                >
                  <RecipeCard recipe={recipe} className="w-100" />
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-muted mt-4">
                No recipes here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
