import React from 'react';
import styles from '../../Pages/AdminView/AdminDashboard.module.css';
const Header = () => {
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light ${styles.header}`}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">AdminHub</a>
        <form className="d-flex ms-auto">
          <input className="form-control me-2" type="search" placeholder="Search" />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </nav>
  );
};

export default Header;
