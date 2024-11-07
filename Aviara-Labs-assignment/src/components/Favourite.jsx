import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Favourite.css";

const Favourite = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    axios
      .get("http://localhost:3000/favourites")
      .then((response) => {
        setFavorites(response.data);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
      });
  };

  const deleteFavorite = (id) => {
    axios
      .delete(`http://localhost:3000/favourites/${id}`)
      .then(() => {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting favorite:", error);
      });
  };

  const handleCityClick = (city) => {
    navigate(`/favourite-place/${city}`);
  };

  return (
    <div className="favourite-container">
      <h2>Favorite Places</h2>
      <div className="cards">
        {favorites.length ? (
          favorites.map((fav) => (
            <div
              className="card"
              key={fav.id}
              onClick={() => handleCityClick(fav.city)}
            >
              <h3>{fav.city}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();  
                  deleteFavorite(fav.id);
                }}
                className="delete-btn"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="card">
            <p>No favorite places added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourite;
