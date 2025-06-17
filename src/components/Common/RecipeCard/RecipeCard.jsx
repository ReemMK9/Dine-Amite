import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeCard.module.css";
import supabase from "../../../config/supabaseClient";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    //to lock scroll when list overlay is shown
    if (showOverlay) {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
  return () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };
  }, [showOverlay]);


  const handleClick = () => {
    if (recipe?.recipe_id) {
      navigate(`/recipedetails/${recipe.recipe_id}`);
    }
  };

  const fetchUserLists = async () => {
    setErrorMsg("");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      setErrorMsg("Auth error: " + userError.message);
      return;
    }
    if (!user) {
      setErrorMsg("You must be logged in.");
      return;
    }
    const { data, error } = await supabase
      .from("recipe_saved")
      .select("*")
      .eq("user_id", user.id);
    if (error) {
      setErrorMsg("Error fetching lists: " + error.message);
    }
    setUserLists(data || []);
  };

  const handleShowOverlay = (e) => {
    e.stopPropagation();
    setShowOverlay(true);
    setSuccessMsg(false);
    fetchUserLists();
  };

  //add recipe to a list
  const handleAddToList = async (recipe_saved_id) => {
    setErrorMsg("");
    //check if already in list
    const { data: existing, error: checkError } = await supabase
      .from("recipe_saved_items")
      .select("*")
      .eq("recipe_saved_id", recipe_saved_id)
      .eq("recipe_id", recipe.recipe_id)
      .maybeSingle();
    if (checkError) {
      setErrorMsg("Error checking list: " + checkError.message);
      return;
    }
    if (existing) {
      setErrorMsg("Recipe is already in this list.");
      return;
    }
    const { data, error } = await supabase
      .from("recipe_saved_items")
      .insert([{ recipe_saved_id, recipe_id: recipe.recipe_id }]);
     if (error) {
      setErrorMsg("Error adding to list: " + error.message);
      return;
    }
    setSuccessMsg(true);
    setTimeout(() => {
      setShowOverlay(false);
      setSuccessMsg(false);
    }, 1400);
  };

  //add a new list for the user
  const handleAddList = async () => {
    setErrorMsg("");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      setErrorMsg("Auth error: " + userError.message);
      return;
    }
    if (!user || !newListName.trim()) {
      setErrorMsg("Please enter a list name.");
      return;
    }
    const { data, error } = await supabase
      .from("recipe_saved")
      .insert([{ user_id: user.id, name: newListName.trim() }])
      .select("*")
      .single();
    if (error) {
      setErrorMsg("Error creating list: " + error.message);
      return;
    }
    setUserLists([...userLists, data]);
    setNewListName("");
    setShowAddInput(false);
  };

  if (!recipe) return null;

  return (
    <>
      <div
        className={styles.recipeCard}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        <div className={styles.recipeImage}>
          <img
            className={styles.recImage}
            src={recipe.image || "/placeholder.jpg"}
            alt={recipe.title || "Recipe"}
          />
          <button
            onClick={handleShowOverlay}
            className={styles.saveButton}
          >
            <i className="material-symbols-outlined">add_circle</i>
          </button>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.recipeTitleContainer}>
            <h2 className={styles.recipeTitle}>{recipe.title}</h2>
          </div>
          <div className={styles.recipeDuration}>{recipe.ready_in}</div>
        </div>
      </div>

      {showOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <button onClick={() => setShowOverlay(false)} className={styles.closeButton}>
              <i className="material-symbols-outlined">close</i>
            </button>
            <h3 className={styles.overlayTitle}>Select a List</h3>
            {/* <hr classname={styles.hrList}/> */}
            {successMsg ? (
              <div className={styles.successMsg}>
                <i className="material-symbols-outlined" style={{ fontSize: "1.5em", color: "#43a047", verticalAlign: "middle" }}>
                  check_circle
                </i>
                <i style={{ marginLeft: "0", fontWeight: 500 }}>Recipe added to list!</i>
              </div>
            ) : (
              <>
                {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
                {userLists.length > 0 ? (
                  <ul className={styles.listGroup}>
                    {userLists.map((list) => (
                      <li
                        key={list.recipe_saved_id}
                        onClick={() => handleAddToList(list.recipe_saved_id)}
                        className={styles.listItem}
                      >
                        {list.name || `List ${list.recipe_saved_id}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No lists found.</p>
                )}
                <div className={styles.addListSection}>
                  {showAddInput ? (
                    <>
                      <input
                        type="text"
                        placeholder="New list name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className={styles.addListInput}
                      />
                      <button className={styles.saveListBtn} onClick={handleAddList}>Save</button>
                      <button className={styles.cancelListBtn} onClick={() => setShowAddInput(false)}>Cancel</button>
                    </>
                  ) : (
                    <button className={styles.addListBtn} onClick={() => setShowAddInput(true)}>
                      <i className="material-symbols-outlined">add</i>Add List
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;