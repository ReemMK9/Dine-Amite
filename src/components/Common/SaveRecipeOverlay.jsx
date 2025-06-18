import React, { useEffect, useState } from "react";
import styles from "./SaveRecipeOverlay.module.css";
import supabase from "../../config/supabaseClient";

const SaveRecipeOverlay = ({ recipeId, open, onClose }) => {
  const [userLists, setUserLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (open) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      fetchUserLists();
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

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

  const handleAddToList = async (recipe_saved_id) => {
    setErrorMsg("");
    setSuccessMsg(false);
    const { data: existing, error: checkError } = await supabase
      .from("recipe_saved_items")
      .select("*")
      .eq("recipe_saved_id", recipe_saved_id)
      .eq("recipe_id", recipeId)
      .maybeSingle();
    if (checkError) {
      setErrorMsg("Error checking list: " + checkError.message);
      return;
    }
    if (existing) {
      setErrorMsg("Recipe is already in this list.");
      return;
    }
    const { error } = await supabase
      .from("recipe_saved_items")
      .insert([{ recipe_saved_id, recipe_id: recipeId }]);
    if (error) {
      setErrorMsg("Error adding to list: " + error.message);
      return;
    }
    setSuccessMsg(true);
    setTimeout(() => {
      onClose();
      setSuccessMsg(false);
    }, 1400);
  };

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

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <button onClick={onClose} className={styles.closeButton}>
          <i className="material-symbols-outlined">close</i>
        </button>
        <h3 className={styles.overlayTitle}>Select a List</h3>
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
  );
};

export default SaveRecipeOverlay;