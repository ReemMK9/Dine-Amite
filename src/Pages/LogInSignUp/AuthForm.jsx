import React, { useState } from "react";
import styles from "./AuthForm.module.css";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      alert(`${isSignup ? "Signed up" : "Logged in"} successfully!`);
      // Here you would typically send data to your backend (e.g., Supabase)
      console.log("Form Data:", formData);
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className={`${styles.card} shadow p-4`}>
            <h2 className="text-center mb-4">
              {isSignup ? "Sign Up" : "Log In"}
            </h2>
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
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
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
                {isSignup
                  ? "Already have an account?"
                  : "Don’t have an account?"}{" "}
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
