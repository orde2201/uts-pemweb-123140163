import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../component/Header";
import "./admin.css";
import HeaderAdmin from "../page/HeaderAdmin.jsx";
import Footer from "../component/footer.jsx";

export default function Admin() {
  const [allMeals, setAllMeals] = useState([]); // semua data
  const [filteredMeals, setFilteredMeals] = useState([]); // hasil filter
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  //  Ambil semua makanan dari A-Z saat awal
  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        const requests = alphabet.map((letter) =>
          axios.get(`${BASE_URL}search.php?f=${letter}`),
        );

        const responses = await Promise.all(requests);
        const meals = responses
          .flatMap((res) => res.data.meals || [])
          .filter((m) => m && m.strMeal);
        setAllMeals(meals);
        setFilteredMeals(meals);
      } catch (err) {
        console.error("Error fetching all meals:", err);
      }
    };

    const fetchFilters = async () => {
      try {
        const [catRes, areaRes] = await Promise.all([
          axios.get(`${BASE_URL}list.php?c=list`),
          axios.get(`${BASE_URL}list.php?a=list`),
        ]);
        setCategories(catRes.data.meals.map((c) => c.strCategory));
        setAreas(areaRes.data.meals.map((a) => a.strArea));
      } catch (err) {
        console.error("Error fetching filter list:", err);
      }
    };

    fetchAllMeals();
    fetchFilters();
  }, []);

  //  Filter berdasarkan kategori atau negara
  useEffect(() => {
    let filtered = allMeals;

    if (selectedCategory) {
      filtered = filtered.filter(
        (meal) => meal.strCategory === selectedCategory,
      );
    }

    if (selectedArea) {
      filtered = filtered.filter((meal) => meal.strArea === selectedArea);
    }

    setFilteredMeals(filtered);
  }, [selectedCategory, selectedArea, allMeals]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedArea(""); // reset area
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    setSelectedCategory(""); // reset category
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="admin-container">
        <h2>📊 Admin Panel</h2>

        {/* Dropdown filter */}
        <div className="filter-section">
          <select
            className="option"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Filter by Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="option"
            value={selectedArea}
            onChange={handleAreaChange}
          >
            <option value="">Filter by Country</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel hasil */}
        {filteredMeals.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#666" }}>
            Data tidak ditemukan.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Makanan</th>
                <th>Kategori</th>
                <th>Negara</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeals.map((meal) => (
                <tr key={meal.idMeal}>
                  <td>{meal.strMeal}</td>
                  <td>{meal.strCategory}</td>
                  <td>{meal.strArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
}
