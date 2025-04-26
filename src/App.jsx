import styles from "./App.module.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/roboto";
import Navbar from "./components/Common/Navbar/Navbar";
import Footer from "./components/Common/Footer/Footer";
import RecipeCard from "./components/Common/RecipeCard/RecipeCard";
import Home from "./Pages/Home/Home";
import RecipeDetails from "./Pages/RecipeDetails";
// import LogIn from "./Pages/LogInSignUp/LogIn";
import SearchResults from "./Pages/Search Results/SearchResults";

function App() {
  return (
    <div className={styles.App}>
      {/* <Navbar /> */}
      <Router>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/" element={<RecipeDetails />} />
          {/* <Route path="/Login" element={<LogIn />} /> */}
          <Route path="/SearchResults" element={<SearchResults/>} />
          
        </Routes>

      </Router>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
