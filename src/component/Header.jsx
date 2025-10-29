// src/component/Header.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./componentStyle.css";

export default function Header({
  onSearch,
  onFilterCategory,
  onFilterArea,
  onRandomClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  useEffect(() => {
    // ambil kategori
    axios
      .get(`${BASE_URL}categories.php`)
      .then((res) => {
        if (res.data.categories) {
          setCategories(res.data.categories.map((c) => c.strCategory));
        }
      })
      .catch((err) => console.error("Error fetch categories:", err));

    // ambil area (country)
    axios
      .get(`${BASE_URL}list.php?a=list`)
      .then((res) => {
        if (res.data.meals) {
          setAreas(res.data.meals.map((a) => a.strArea));
        }
      })
      .catch((err) => console.error("Error fetch areas:", err));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    onFilterCategory(cat);
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    onFilterArea(area);
  };

  return (
    <header className="header">
      <button id="random" className="option" onClick={onRandomClick}>
        Random
      </button>

      <select
        className="option"
        onChange={handleCategoryChange}
        defaultValue=""
      >
        <option value="">Kategori</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select className="option" onChange={handleAreaChange} defaultValue="">
        <option value="">Country</option>
        {areas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
      <form onSubmit={handleSearchSubmit} id="search-input">
        <input
          type="text"
          placeholder="Cari resep..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="option search-input"
        />
        <button type="submit" className="option">
          Search
        </button>
      </form>
    </header>
  );
}
