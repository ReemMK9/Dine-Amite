import React, { useState, useEffect } from "react";
import styles from "./UserProfile.module.css";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";
import supabase from "../../config/supabaseClient";
import GroceryList from "../../components/UserProfiles/GroceryList";
import { useParams } from "react-router-dom";

const UserProfile = () => {

  const [userLists, setUserLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeListId, setActiveListId] = useState(null);
  const [activeTabType, setActiveTabType] = useState("saved");
  const [savedListRecipes, setSavedListRecipes] = useState([]);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setImg] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { userId } = useParams();

  // fetch profile and lists
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data } = await supabase
        .from("app_user")
        .select("display_name, bio, img")
        .eq("user_id", userId)
        .single();
      if (data) {
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setImg(data.img || "");
      }
    };
    const fetchUserLists = async () => {
      setErrorMsg("");
      const { data, error } = await supabase
        .from("recipe_saved")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (error) setErrorMsg("Error fetching lists: " + error.message);
      setUserLists(data || []);
      if (data && data.length > 0 && !activeListId) {
        setActiveListId(data[0].recipe_saved_id);
      }
    };
    fetchUserProfile();
    fetchUserLists();
  }, [userId]);

  // fetch recipes for the selected list
  useEffect(() => {
    const fetchSavedListRecipes = async () => {
      if (!activeListId) return;
      const { data } = await supabase
        .from("recipe_saved_items")
        .select("recipe_id, recipe:recipe_id(*)")
        .eq("recipe_saved_id", activeListId);
      setSavedListRecipes(data?.map(item => item.recipe) || []);
    };
    if (activeTabType === "saved") fetchSavedListRecipes();
  }, [activeListId, activeTabType]);

  // add new list
  const handleAddList = async () => {
    setErrorMsg("");
    if (!newListName.trim()) {
      setErrorMsg("Please enter a list name.");
      return;
    }
    const { data, error } = await supabase
      .from("recipe_saved")
      .insert([{ user_id: userId, name: newListName.trim() }])
      .select("*")
      .single();
    if (error) {
      setErrorMsg("Error creating list: " + error.message);
      return;
    }
    setUserLists([...userLists, data]);
    setActiveListId(data.recipe_saved_id);
    setActiveTabType("saved");
    setNewListName("");
    setShowAddInput(false);
  };

  // delete list
  const handleDeleteList = async (listId) => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;
    const { error } = await supabase
      .from("recipe_saved")
      .delete()
      .eq("recipe_saved_id", listId);
    if (error) {
      setErrorMsg("Error deleting list: " + error.message);
      return;
    }
    setUserLists(userLists.filter((list) => list.recipe_saved_id !== listId));
    //reset selection if deleted list was selected
    if (activeListId === listId) {
      setActiveListId(null);
      setSavedListRecipes([]);
    }
  };

  return (
    <div className="container-fluid col-12">
      <div className="row justify-content-center">
        <div className="col-10 mt-4">
          <h1>{displayName ? `${displayName}'s Recipe Book` : "User Profile"}</h1>
          {/* profile info section */}
          <div className={`row col-10 ${styles.infoBox}`}>
            <div className={`col-12 col-md-4 d-flex justify-content-center ${styles.userImgContainer}`}>
              <div className={styles.userImg}>
                <img
                  src={userImg || "/placeholder-user.png"}
                  alt="User"
                  className={styles.profileImg}
                />
              </div>
            </div>
            <div className="col-12 col-md-8">
              <div className={styles.userInfo}>
                <div className={styles.userBio}>
                  {editing ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving(true);
                        await supabase
                          .from("app_user")
                          .update({ display_name: displayName, bio })
                          .eq("user_id", userId);
                        setSaving(false);
                        setEditing(false);
                      }}
                      className={styles.editProfileForm}
                    >
                      <input
                        className={styles.editInput}
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="Display Name"
                      />
                      <textarea
                        className={styles.editInput}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Bio"
                        rows={3}
                      />
                      <button className={styles.saveBtn} type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button className={styles.cancelBtn} type="button" onClick={() => setEditing(false)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <div><strong>{displayName || "No display name"}</strong></div>
                      <div>{bio || "No bio yet."}</div>
                      <button className={styles.editBtn} onClick={() => setEditing(true)}>
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className={styles.userProfileTabs}>
            <div className="col-12">
              <div className="d-flex flex-nowrap overflow-auto gap-2 align-items-start">
                {showAddInput ? (
                  <>
                    <input
                      type="text"
                      autoFocus
                      className={styles.tabInput}
                      value={newListName}
                      onChange={e => setNewListName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleAddList(); }}
                      onBlur={() => {
                        setTimeout(() => setShowAddInput(false), 200);
                      }}
                      placeholder="New list name"
                    />
                    <button className={styles.saveListBtn} onClick={handleAddList}>Save</button>
                    <button className={styles.cancelListBtn} onClick={() => setShowAddInput(false)}>Cancel</button>
                  </>
                ) : (
                  <button
                    className={`${styles.tabButton} ${styles.addTabButton}`}
                    onClick={() => setShowAddInput(true)}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                )}
                {/* user saved lists */}
                {userLists.map((list) => (
                  <div key={list.recipe_saved_id} className={styles.listTabWrapper}>
                    <button
                      onClick={() => {
                        setActiveListId(list.recipe_saved_id);
                        setActiveTabType("saved");
                      }}
                      className={`${styles.tabButton} ${activeListId === list.recipe_saved_id && activeTabType === "saved" ? styles.activeTab : ""}`}
                    >
                      {list.name}
                      <button
                      className={styles.deleteTabBtn}
                      title="Delete list"
                      onClick={() => handleDeleteList(list.recipe_saved_id)}
                      type="button"
                    >
                      ×
                    </button>
                    </button>
                    
                  </div>
                ))}
                {/* grocery list button */}
                <button
                  className={`${styles.tabButton} ${activeTabType === "grocery" ? styles.activeTab : ""}`}
                  onClick={() => {
                    setActiveTabType("grocery");
                    setActiveListId(null);
                  }}
                >
                  <i className="material-symbols-outlined">grocery</i>
                  Grocery Lists
                </button>
              </div>
            </div>
            <div className="col-12">
              <hr className={styles.tabsHr} />
            </div>
          </div>

          {/* content displayed */}
          <div className={`row ${styles.userProfItems}`}>
            <div className="col-12">
              {activeTabType === "saved" && activeListId ? (
                savedListRecipes.length > 0 ? (
                  <div className="row">
                    {savedListRecipes.map((recipe) => (
                      <div key={recipe.recipe_id} className="col-12 col-sm-6 col-md-4 col-xl-3 d-flex mb-4">
                        <RecipeCard recipe={recipe} className="w-100" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted mt-4">
                    No recipes in this list.
                  </div>
                )
              ) : activeTabType === "grocery" ? (
                <GroceryList />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;