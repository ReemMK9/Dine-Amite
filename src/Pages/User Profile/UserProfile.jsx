import React from "react";
import styles from "./UserProfile.module.css";
import RecipeCard from "../../components/Common/RecipeCard/RecipeCard";


const UserProfile = () => {
  return (
    <>
      <h1>'s Recipe Box</h1>
      <div className={styles.infoBox}>
        <div className={styles.userProfPic}>
          <div className={styles.userimg}></div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userBio}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, molestias. Explicabo delectus nulla illum eius nemo ab labore nostrum totam omnis cumque officia veritatis tempora, quam facilis corporis nobis quibusdam.</div>
          <div className={styles.userSocials}>
            <span>1000+ subscribers</span>
            <button>Share</button>
          </div>
        </div>
      </div>
      <div className={styles.userProfileTabs}>
        <button>Saved Recipes</button>
        <button>Favorites</button>
        <button>Collection Name</button>
        <button>Collection Name</button>
        <button>History</button>
        <hr />
      </div>
      <div className={styles.userProfItems}>
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
        <RecipeCard />

      </div>
    </>
  );
};

export default UserProfile;
