import Dashboard from "./components/Dashboard.jsx";
import Favourite from "./components/Favourite.jsx";
import FavouritePlace from "./components/FavouritePlace.jsx";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="main">
      <div className="background">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/favourites" element={<Favourite />} />
          <Route path="/favourite-place/:place" element={<FavouritePlace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
