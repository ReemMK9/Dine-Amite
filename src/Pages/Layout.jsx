import React from "react";
import Navbar from "../components/Common/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Common/Footer/Footer";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet></Outlet>
      <Footer />
    </div>
  );
};

export default Layout;
