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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  // 🔹 Ambil kategori & area saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, areaRes] = await Promise.all([
          axios.get(`${BASE_URL}categories.php`),
          axios.get(`${BASE_URL}list.php?a=list`),
        ]);

        if (catRes.data.categories) {
          setCategories(catRes.data.categories.map((c) => c.strCategory));
        }

        if (areaRes.data.meals) {
          setAreas(areaRes.data.meals.map((a) => a.strArea));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [BASE_URL]);

  // 🔹 Handler pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) onSearch(searchTerm.trim());
  };

  // 🔹 Handler filter kategori
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedArea(""); // reset country jika pilih kategori
    if (value) onFilterCategory(value);
  };

  // 🔹 Handler filter country
  const handleAreaChange = (e) => {
    const value = e.target.value;
    setSelectedArea(value);
    setSelectedCategory(""); // reset kategori jika pilih country
    if (value) onFilterArea(value);
  };

  return (
    <header className="header">
      {/* ====== Logo ====== */}
      <div className="logo">
        🍳 <span>Dapoerku</span>
      </div>

      {/* ====== Tombol & Filter ====== */}
      <div className="header-controls">
        {/* Tombol random */}
        <button id="random" className="option" onClick={onRandomClick}>
          Random
        </button>

        {/* Dropdown kategori */}
        <select
          className="option"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Dropdown country */}
        <select
          className="option"
          value={selectedArea}
          onChange={handleAreaChange}
        >
          <option value="">Pilih Country</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        {/* Form pencarian */}
        <form onSubmit={handleSearchSubmit} className="search-container">
          <input
            type="text"
            placeholder="Cari resep..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            🔍
          </button>
        </form>
      </div>
    </header>
  );
}
