import React, { useState } from "react";
import styles from "./GroceryList.module.css";

const initialData = [
  {
    title: "Fruits & Veggies",
    color: "#d5f7af",
    items: ["Apples", "Bananas", "Carrots", "Tomatoes", "Lettuce"],
  },
  {
    title: "Frozen Goods",
    color: "#e6e5fb",
    items: ["Frozen peas", "Ice cream", "Frozen pizza"],
  },
  {
    title: "Snacks",
    color: "#fffbd1",
    items: ["Chips", "Chocolate bars", "Trail mix", "Cookies"],
  },
  {
    title: "Dairy Products",
    color: "#e5fbe5",
    items: ["Milk", "Cheese", "Yogurt", "Butter"],
  },
  {
    title: "Beverages",
    color: "#fef4c3",
    items: ["Orange juice", "Coffee", "Tea", "Bottled water"],
  },
  {
    title: "Pantry Staples",
    color: "#d6effe",
    items: [
      "Rice",
      "Pasta",
      "Canned beans",
      "Spices",
      "Flour",
      "Sugar",
      "Oil",
      "Salt",
    ],
  },
];

const GroceryList = () => {
  const [lists, setLists] = useState(initialData);
  const [checkedItems, setCheckedItems] = useState({});
  const [newListTitle, setNewListTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleCheck = (category, item) => {
    const key = `${category}-${item}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddItem = (listIndex, value) => {
    if (!value.trim()) return;
    const updated = [...lists];
    updated[listIndex].items.push(value.trim());
    setLists(updated);
  };

  const handleDeleteItem = (listIndex, itemIndex) => {
    const updated = [...lists];
    updated[listIndex].items.splice(itemIndex, 1);
    setLists(updated);
  };

  const handleDeleteList = (listIndex) => {
    const updated = [...lists];
    updated.splice(listIndex, 1);
    setLists(updated);
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    const newEntry = {
      title: newListTitle,
      color: "#ffffff",
      items: [],
    };

    setLists((prev) => [newEntry, ...prev]);
    setNewListTitle("");
    setIsAdding(false);
  };

  return (
    <div className={`row ${styles.wrapper} gx-4 gy-4`}>
      <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
        <div
          className={`${styles.card} ${styles.placeholderWrapper} w-100`}
          onClick={() => setIsAdding(true)}
          style={{ cursor: "pointer" }}
        >
          {isAdding ? (
            <form onSubmit={handleCreateList} className={styles.addCardForm}>
              <input
                type="text"
                placeholder="List name..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
              />
              <button type="submit">Create</button>
            </form>
          ) : (
            <div className={styles.placeholderCard}>➕ New List</div>
          )}
        </div>
      </div>

      {lists.map((section, listIndex) => (
        <div
          key={section.title + listIndex}
          className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
        >
          <div
            className={`${styles.card} w-100`}
            style={{
              border: `3px solid ${section.color}`,
              backgroundColor: "transparent", // or any neutral background you prefer
            }}
          >
            <div className={styles.cardHeader}>
              <input
                type="color"
                className={styles.colorPicker}
                value={section.color}
                onChange={(e) => {
                  const updated = [...lists];
                  updated[listIndex].color = e.target.value;
                  setLists(updated);
                }}
              />
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <button
                className={styles.deleteListBtn}
                onClick={() => handleDeleteList(listIndex)}
              >
                🗑️
              </button>
            </div>

            <ul className={styles.itemList}>
              {section.items.map((item, itemIndex) => {
                const key = `${section.title}-${item}`;
                return (
                  <li key={key} className={styles.itemRow}>
                    <label className={styles.label}>
                      <input
                        type="checkbox"
                        checked={!!checkedItems[key]}
                        onChange={() => handleCheck(section.title, item)}
                      />
                      <span className={styles.itemText}>{item}</span>
                    </label>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteItem(listIndex, itemIndex)}
                    >
                      ❌
                    </button>
                  </li>
                );
              })}
              {section.items.length === 0 && (
                <li className={styles.empty}>No items listed.</li>
              )}
            </ul>

            <form
              className={styles.addForm}
              onSubmit={(e) => {
                e.preventDefault();
                const value = e.target.elements[0].value;
                handleAddItem(listIndex, value);
                e.target.reset();
              }}
            >
              <input type="text" placeholder="Add item..." />
              <button type="submit">➕</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroceryList;
