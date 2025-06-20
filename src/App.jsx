// src/App.jsx

import styles from "./App.module.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/roboto";
import Home from "./Pages/Home/Home";
import SearchResults from "./Pages/Search Results/SearchResults";
import RecipeDetails from "./Pages/RecipeDetails";
import CategoryResults from "./Pages/CategoryResults";
import NotFound from "./Pages/NotFound";
import Layout from "./Pages/Layout";
import Recipes from "./Pages/Recipes/Recipes";
import UserProfile from "./Pages/User Profile/UserProfile";
import AdminDashboard from "./Pages/AdminView/AdminDashboard";
import AuthForm from "./Pages/LogInSignUp/AuthForm";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "searchresults/:query", element: <SearchResults /> },
        { path: "category/:categoryId/:categoryName", element: <CategoryResults /> },
        { path: "recipes", element: <Recipes /> },
        { path: "recipedetails/:id", element: <RecipeDetails /> },
        { path: "userprofile/:userId", element: <UserProfile /> },
        { path: "admindashboard", element: <AdminDashboard /> },
        { path: "login", element: <AuthForm /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    // Admin Dashboard - Separate route outside main layout
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
  ]);

  return (
    <div className={styles.App}>
      <RouterProvider router={routes}></RouterProvider>
    </div>
  );
}

export default App;