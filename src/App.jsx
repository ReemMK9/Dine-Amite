import styles from "./App.module.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/roboto";
import Home from "./Pages/Home/Home";
import SearchResults from "./Pages/Search Results/SearchResults";
import RecipeDetails from "./Pages/RecipeDetails";
import NotFound from "./Pages/NotFound";
// import Navbar from "./components/Common/Navbar/Navbar";
import Layout from "./Pages/Layout";
import Recipes from "./Pages/Recipes/Recipes";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "searchresults", element: <SearchResults /> },
        { path: "recipes", element: <Recipes /> },
        { path: "recipedetails", element: <RecipeDetails /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);
  return (
    <div className={styles.App}>
    
      <RouterProvider router={routes}></RouterProvider>
    </div>
  );
}

export default App;
