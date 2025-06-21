import React, { useState, useEffect } from "react";
import styles from "./AuthForm.module.css";
import supabase from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/landing.jpg";

const AuthForm = () => {
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({ displayName: "", email: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (isSignup && !formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };

  const signUp = async (email, password, displayName) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { displayName } },
    });

    if (error) {
      console.error("Sign-up error:", error.message);
      setErrors((prev) => ({ ...prev, general: error.message }));
    } else {
      console.log("User signed up:", user);
    }
  };

  const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      setErrors((prev) => ({ ...prev, general: error.message }));
    } else {
      console.log("User logged in:", user);
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length === 0) {
      if (isSignup) {
        await signUp(formData.email, formData.password, formData.displayName);
      } else {
        await signIn(formData.email, formData.password);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className={`container-fluid vh-100 d-flex align-items-stretch p-0`}>
      <div className="row flex-grow-1 w-100 m-0">
        {/* Image: only visible on large screens and up */}
        <div className={`col-lg-6 d-none d-lg-flex ${styles.imgContainer} p-0`}>
          <img src={img} alt="" className={`${styles.loginImg} w-100 h-100`} />
        </div>
        {/* Form: always visible, and has background image on md and below */}
        <div
          className={`col-12 col-lg-6 d-flex align-items-center justify-content-center p-0 ${styles.formBg}`}
          style={{
            backgroundImage: `url(${img})`,
          }}
        >
          <div className={`${styles.card} shadow p-4 w-100`} style={{ maxWidth: 420 }}>
            {/* ...form content... */}
            <h2 className="text-center mb-4">{isSignup ? "Sign Up" : "Log In"}</h2>
            <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className="mb-3">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className={`form-control ${
                  errors.displayName ? "is-invalid" : ""
                }`}
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
              />
              {errors.displayName && (
                <div className="invalid-feedback">{errors.displayName}</div>
              )}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isSignup ? "Sign Up" : "Log In"}
          </button>
              </form>
            <div className="text-center mt-3">
              <small>
                {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
                <button
                  type="button"
                  className={`btn btn-link p-0 ${styles.toggleButton}`}
                  onClick={toggleMode}
                >
                  {isSignup ? "Log In" : "Sign Up"}
                </button>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;