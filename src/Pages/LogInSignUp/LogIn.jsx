import React from "react";
import styles from "./Login.module.css";

const LogIn = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formBox + " " + styles.login}>
        <form action="#">
          <h1>Log in</h1>
          <div className={styles.inputBox}>
            <input type="text" placeholder="Username" required />
            {/* <i className={styles.bx - bxs - user}></i> */}
          </div>
          <div className={styles.inputBox}>
            <input type="password" placeholder="password" required />
            {/* <i className={styles.bx - bxs - lock - alt}></i> */}
          </div>
          <div className={styles.forgotLink}>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className={styles.btn}>
            Log In
          </button>
          <p>or login with social platforms</p>
          {/* <div className={styles.socialIcons}>
          <a href="">
            <i className="bx bxl-facebook"></i>
          </a>
          <a href="">
            <i className="bx bxl-twitter"></i>
          </a>
          <a href="">
            <i className="bx bxl-google"></i>
          </a>
          <a href="">
            <i className="bx bxl-linkedin"></i>
          </a>
          <a href="">
            <i className="bx bxl-github"></i>
          </a>
        </div> */}
        </form>
      </div>
      <div className={styles.formBox + " " + styles.register}>
        <form action="#">
          <h1>Sign Up</h1>
          <div className={styles.inputBox}>
            <input type="text" placeholder="Username" required />
            {/* <i className={styles.bx - bxs - user}></i> */}
          </div>
          <div className={styles.inputBox}>
            <input type="email" placeholder="Email" required />
            {/* <i className={styles.bx - bxs - envelope}></i> */}
          </div>
          <div className={styles.inputBox}>
            <input type="password" placeholder="password" required />
            {/* <i className={styles.bx - bxs - lock - alt}></i> */}
          </div>
          <button type="submit" className={styles.btn}>
            Sign Up
          </button>
          <p>or sign up with social platforms</p>
          {/* <div className={styles.socialIcons}>
          <a href="">
            <i className="bx bxl-facebook"></i>
          </a>
          <a href="">
            <i className="bx bxl-twitter"></i>
          </a>
          <a href="">
            <i className="bx bxl-google"></i>
          </a>
          <a href="">
            <i className="bx bxl-linkedin"></i>
          </a>
          <a href="">
            <i className="bx bxl-github"></i>
          </a>
        </div> */}
        </form>
      </div>

      <div className={styles.toggleBox}>
        <div className={styles.togglePanel + " " + styles.toggleLeft}>
          <h1>Hello, Welcome</h1>
          <p>Don't have an account?</p>
          <button className={styles.btn + " " + styles.registerBtn}>
            Sign Up
          </button>
        </div>
        <div className={styles.togglePanel + " " + styles.toggleRight}>
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className={styles.btn + " " + styles.loginBtn}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
