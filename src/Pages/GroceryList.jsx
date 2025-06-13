import React from "react";
import styles from "./GroceryList.module.css"; // CSS module import

const GroceryList = () => {
  return (
    <div className={`d-flex ${styles.wrapper}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>


        <div className={styles.menu}>
          <button className={styles.menuBtn}>
            <i className="bi bi-check-circle me-2"></i> Done
          </button>
          <button className={styles.menuBtn}>
            <i className="bi bi-star me-2"></i> Important
          </button>
          <button className={styles.menuBtn}>
            <i className="bi bi-trash me-2"></i> Remove
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* <div className={styles.navbar}>
          <div className={styles.navLinks}>
            <span>Homepage</span>
            <span>Recipe Page</span>
            <span>Blogs</span>
          </div>
          <div className={styles.navIcons}>
            <i className={`bi bi-gear ${styles.settingsIcon}`}></i>
            <div className={styles.profileCircle}></div>
          </div>
        </div> */}

        <div className="container">
          <div className="row g-4">
            <div className="col-sm-6 col-md-4">
              <AddListCard color="orange" />
            </div>
            <div className="col-sm-6 col-md-4">
              <AddListCard color="peach" />
            </div>
            <div className="col-sm-6 col-md-4">
              <AddListCard color="mint" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AddListCard = ({ color }) => {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <p>Add new list</p>
      <span>+</span>
    </div>
  );
};

export default GroceryList;
