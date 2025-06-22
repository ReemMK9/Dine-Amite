import React, { useState, useEffect, useRef } from "react";
import styles from "./GroceryList.module.css";
import supabase from "../../config/supabaseClient";

const GroceryList = () => {
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [newListTitle, setNewListTitle] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [loading, setLoading] = useState(true);

  const [allIngredients, setAllIngredients] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [showDropdown, setShowDropdown] = useState({});
  const inputRefs = useRef({});

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    const fetchIngredients = async () => {
    const { data } = await supabase.from("ingredient").select("*");
    setAllIngredients(data || []);
  };
    fetchIngredients();
    getUser();
  }, []);
  
  useEffect(() => {
    if (!user) return;
    const fetchLists = async () => {
      setLoading(true);
      const { data: listsData } = await supabase
        .from("grocery_list")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      setLists(listsData || []);
      setLoading(false);

      // Fetch items for each list
      if (listsData && listsData.length > 0) {
        const listIds = listsData.map(l => l.list_id);
        const { data: itemsData } = await supabase
          .from("grocery_list_items")
          .select("*")
          .in("list_id", listIds);

        // Group items by list_id
        const grouped = {};
        const checked = {};
        (itemsData || []).forEach(item => {
          if (!grouped[item.list_id]) grouped[item.list_id] = [];
          grouped[item.list_id].push(item);
          checked[`${item.list_id}-${item.ingredient_id}`] = item.checked;
        });
        setItems(grouped);
        setCheckedItems(checked);
      } else {
        setItems({});
        setCheckedItems({});
      }
    };
    fetchLists();
  }, [user]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    const { data, error } = await supabase
      .from("grocery_list")
      .insert([{ user_id: user.id, list_name: newListTitle.trim() }])
      .select()
      .single();
    if (!error && data) {
      setLists(prev => [...prev, data]);
      setNewListTitle("");
      setShowAddList(false);
    }
  };


  const handleAddItem = async (listId, ingredient) => {
    if (!ingredient) return;
    const ingredient_id = ingredient.ingredient_id;
    const { data, error } = await supabase
      .from("grocery_list_items")
      .insert([{ list_id: listId, ingredient_id, checked: false }])
      .select()
      .single();
    if (!error && data) {
      setItems(prev => ({
        ...prev,
        [listId]: [...(prev[listId] || []), data],
      }));
    }
    setSearchValue(prev => ({ ...prev, [listId]: "" }));
    setShowDropdown(prev => ({ ...prev, [listId]: false }));
  };

  const handleDeleteItem = async (listId, ingredient_id) => {
    await supabase
      .from("grocery_list_items")
      .delete()
      .eq("list_id", listId)
      .eq("ingredient_id", ingredient_id);
    setItems(prev => ({
      ...prev,
      [listId]: (prev[listId] || []).filter(item => item.ingredient_id !== ingredient_id),
    }));
  };

  const handleDeleteList = async (listId) => {
    await supabase.from("grocery_list").delete().eq("list_id", listId);
    setLists(prev => prev.filter(l => l.list_id !== listId));
    setItems(prev => {
      const copy = { ...prev };
      delete copy[listId];
      return copy;
    });
  };

  const handleCheck = async (listId, ingredient_id, checked) => {
    await supabase
      .from("grocery_list_items")
      .update({ checked: !checked })
      .eq("list_id", listId)
      .eq("ingredient_id", ingredient_id);
    setCheckedItems(prev => ({
      ...prev,
      [`${listId}-${ingredient_id}`]: !checked,
    }));
  };

    // Handle ingredient search input
  const handleSearchChange = (listId, value) => {
    setSearchValue(prev => ({ ...prev, [listId]: value }));
    if (value.trim().length === 0) {
      setSearchResults(prev => ({ ...prev, [listId]: [] }));
      setShowDropdown(prev => ({ ...prev, [listId]: false }));
      return;
    }
    const results = allIngredients.filter(ing =>
      ing.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(prev => ({ ...prev, [listId]: results }));
    setShowDropdown(prev => ({ ...prev, [listId]: true }));
  };

  // Handle dropdown selection
  const handleSelectIngredient = (listId, ingredient) => {
    handleAddItem(listId, ingredient);
  };

  // Close dropdown on blur
  const handleBlur = (listId) => {
    setTimeout(() => {
      setShowDropdown(prev => ({ ...prev, [listId]: false }));
    }, 120);
  };

  return (
    <div className={`row ${styles.wrapper} gx-4 gy-4`}>
      {/* Add List Button */}
      <div className="col-12">
        <button
          className={styles.addListBtn}
          onClick={() => setShowAddList(true)}
        >
          + Add List
        </button>
      </div>

      {/* Show add list form */}
      {showAddList && (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
          <div className={`${styles.card} ${styles.placeholderWrapper} w-100`}>
            <form onSubmit={handleCreateList} className={styles.addCardForm}>
              <input
                type="text"
                placeholder="List name..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                autoFocus
              />
              <div>
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowAddList(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show all lists */}
      {lists.map((section) => (
        <div
          key={section.list_id}
          className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
        >
          <div className={`${styles.card} w-100`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{section.list_name}</h2>
              <button
                className={styles.deleteListBtn}
                onClick={() => handleDeleteList(section.list_id)}
              >
                <i className="material-symbols-outlined">delete</i>
              </button>
            </div>

            <ul className={styles.itemList}>
              {(items[section.list_id] || []).map((item) => {
                const key = `${section.list_id}-${item.ingredient_id}`;
                const ingredient = allIngredients.find(
                  (ing) => ing.ingredient_id === item.ingredient_id
                );
                return (
                  <li key={key} className={styles.itemRow}>
                    <label className={styles.label}>
                      <input
                        type="checkbox"
                        checked={!!checkedItems[key]}
                        onChange={() =>
                          handleCheck(section.list_id, item.ingredient_id, !!checkedItems[key])
                        }
                      />
                      <p className={styles.itemText}>
                        {ingredient ? ingredient.name : item.ingredient_id}
                      </p>
                    </label>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteItem(section.list_id, item.ingredient_id)}
                    >
                      <i className="material-symbols-outlined">close</i>
                    </button>
                  </li>
                );
              })}
              {(items[section.list_id] || []).length === 0 && (
                <li className={styles.empty}>No items listed.</li>
              )}
            </ul>

            {/* Add item with ingredient search */}
            <div className={styles.addFormWrapper}>
              <input
                type="text"
                placeholder="Add item..."
                value={searchValue[section.list_id] || ""}
                onChange={e => handleSearchChange(section.list_id, e.target.value)}
                onFocus={() => setShowDropdown(prev => ({ ...prev, [section.list_id]: true }))}
                onBlur={() => handleBlur(section.list_id)}
                ref={el => (inputRefs.current[section.list_id] = el)}
                className={styles.addInput}
                autoComplete="off"
              />
              {showDropdown[section.list_id] && searchResults[section.list_id]?.length > 0 && (
                <ul className={styles.dropdown}>
                  {searchResults[section.list_id].map(ingredient => (
                    <li
                      key={ingredient.ingredient_id}
                      className={styles.dropdownItem}
                      onMouseDown={() => handleSelectIngredient(section.list_id, ingredient)}
                    >
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroceryList;
