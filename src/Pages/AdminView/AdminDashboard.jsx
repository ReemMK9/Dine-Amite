import React, { useState } from "react";
import styles from "./AdminDashboard.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBars, FaEye, FaEdit, FaBan } from "react-icons/fa";

const allCustomers = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: "Chelsie Jhonson " + (i + 1),
  phone: "880160000770",
  email: `chelsie${i + 1}@ui8.net`,
  location: "Corner Street 5th London..",
  created: "2 Feb 2022",
  avatar: "https://i.pravatar.cc/40?img=" + ((i % 10) + 1),
}));

const USERS_PER_PAGE = 8;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = allCustomers.filter((cust) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      cust.name.toLowerCase().includes(lowerSearch) ||
      cust.email.toLowerCase().includes(lowerSearch) ||
      cust.phone.includes(lowerSearch) ||
      cust.location.toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / USERS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className={`d-flex ${styles.container}`}>
      <aside
        className={`${styles.sidebar} d-flex flex-column align-items-start ${
          collapsed ? styles.collapsed : ""
        }`}
      >
        <div
          className={styles.toggleBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </div>
        <nav className={styles.navLinks}>
          <a className={styles.link} href="#">
            Overview
          </a>
          <a className={`${styles.link} ${styles.active}`} href="#">
            Customer List
          </a>
          <a className={styles.link} href="#">
            Food Menu
          </a>
          <a className={styles.link} href="#">
            Order
          </a>
          <a className={styles.link} href="#">
            Sales
          </a>
          <a className={styles.link} href="#">
            Wallet
          </a>
          <a className={styles.link} href="#">
            Reviews and Rating
          </a>
          <a className={styles.link} href="#">
            Advertisement
          </a>
        </nav>
      </aside>

      <main className={`flex-grow-1 ${styles.main}`}>
        <div className={`px-4 pt-4 ${styles.headerSection}`}>
          <h4>Customer</h4>
          <div className={styles.headerActions}>
            <input
              type="text"
              placeholder="Search"
              className="form-control d-inline-block me-2"
              style={{ width: "200px" }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="btn btn-outline-secondary me-2">Filter</button>
            <button className="btn btn-primary me-2">Add Restaurant</button>
            <button className="btn btn-outline-secondary">Export</button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={`table table-hover align-middle ${styles.table}`}>
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input type="checkbox" />
                </th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((cust) => (
                <tr key={cust.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={cust.avatar}
                        alt="avatar"
                        className={styles.avatar}
                      />
                      <span>{cust.name}</span>
                    </div>
                  </td>
                  <td>{cust.phone}</td>
                  <td>{cust.email}</td>
                  <td>{cust.location}</td>
                  <td>{cust.created}</td>
                  <td className="position-relative">
                    <button
                      className="btn btn-light"
                      onClick={() =>
                        setActionMenuOpenId(
                          cust.id === actionMenuOpenId ? null : cust.id
                        )
                      }
                    >
                      &#x22EE;
                    </button>
                    {actionMenuOpenId === cust.id && (
                      <div className={styles.actionMenu}>
                        <button>
                          <FaEye /> View
                        </button>
                        <button>
                          <FaEdit /> Edit
                        </button>
                        <button>
                          <FaBan /> Disable
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 px-4 pb-4">
          <span>
            {currentPage} of {totalPages}
          </span>
          <nav>
            <ul className="pagination mb-0">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  key={i}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
