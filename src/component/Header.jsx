import { useState } from "react";
import "./componentStyle.css";

export default function HeaderApp() {
  return (
    <header className="header">
      <button id="home" className="option">
        home
      </button>
      <button id="random" className="option">
        random
      </button>
      <select id="filter" name="filter" className="option">
        <option value="category">category</option>
        <option value="country">country</option>
      </select>
      <div>
        <input type="search" id="search-input" className="option" />
      </div>
    </header>
  );
}
