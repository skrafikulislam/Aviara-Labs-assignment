import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="main-navbar">
      <div>
        <ul>
          <li>
            <Link className="links-route" to={"/"}>Home</Link>
          </li>
          <li>
            <Link className="links-route" to={"/favourites"}>Favourites</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
