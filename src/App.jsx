// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import foodImage from "./assets/makanan.png";
import Card from "./component/DetailCard.jsx";
import Header from "./component/Header.jsx";
import FloatWindow from "./component/floatwindow.jsx";
import Footer from "./component/footer.jsx";

export default function App() {
  // 🧠 State utama
  const [meals, setMeals] = useState([]);
  const [modalMeal, setModalMeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(""); // category | area | search
  const [filterName, setFilterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  // 🍳 Ambil 4 random meal di awal
  useEffect(() => {
    const fetchRandom = async () => {
      try {
        setLoading(true);
        const requests = Array.from({ length: 4 }, () =>
          axios.get(`${BASE_URL}random.php`),
        );
        const responses = await Promise.all(requests);
        setMeals(responses.map((r) => r.data.meals[0]));
      } catch (err) {
        setError("Gagal memuat data awal.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRandom();
  }, [BASE_URL]);

  // 🔍 Cari resep berdasarkan nama
  const handleSearch = async (term) => {
    if (!term) return setMeals([]);
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}search.php?s=${encodeURIComponent(term)}`,
      );
      setMeals(data.meals || []);
      setActiveFilter("search");
      setFilterName(term);
    } catch {
      setError("Terjadi kesalahan saat mencari resep.");
    } finally {
      setLoading(false);
    }
  };

  // 🏷️ Filter kategori
  const handleFilterCategory = async (category) => {
    if (!category) return setMeals([]);
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}filter.php?c=${encodeURIComponent(category)}`,
      );

      // Ambil detail tiap meal
      const detailedMeals = await Promise.all(
        (data.meals || []).slice(0, 10).map(async (m) => {
          const { data } = await axios.get(
            `${BASE_URL}lookup.php?i=${m.idMeal}`,
          );
          return data.meals[0];
        }),
      );

      setMeals(detailedMeals);
      setActiveFilter("category");
      setFilterName(category);
    } catch {
      setError("Gagal memfilter berdasarkan kategori.");
    } finally {
      setLoading(false);
    }
  };

  // 🌍 Filter negara
  const handleFilterArea = async (area) => {
    if (!area) return setMeals([]);
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}filter.php?a=${encodeURIComponent(area)}`,
      );

      const detailedMeals = await Promise.all(
        (data.meals || []).slice(0, 10).map(async (m) => {
          const { data } = await axios.get(
            `${BASE_URL}lookup.php?i=${m.idMeal}`,
          );
          return data.meals[0];
        }),
      );

      setMeals(detailedMeals);
      setActiveFilter("area");
      setFilterName(area);
    } catch {
      setError("Gagal memfilter berdasarkan negara.");
    } finally {
      setLoading(false);
    }
  };

  // 🎲 Ambil random satu meal untuk modal
  const handleRandomClick = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}random.php`);
      setModalMeal(data.meals[0]);
      setModalOpen(true);
    } catch {
      setError("Gagal memuat resep acak.");
    }
  };

  // 📖 Buka detail dari kartu
  const handleCardClick = async (mealId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}lookup.php?i=${mealId}`);
      setModalMeal(data.meals[0]);
      setModalOpen(true);
    } catch {
      setError("Gagal memuat detail resep.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMeal(null);
  };

  return (
    <div>
      {/* 🧭 Header */}
      <Header
        onSearch={handleSearch}
        onFilterCategory={handleFilterCategory}
        onFilterArea={handleFilterArea}
        onRandomClick={handleRandomClick}
      />

      {/* 🎨 Section utama */}
      <main>
        <img src={foodImage} id="foodImage" alt="Food" />
        <h1 className="title">Recipe</h1>

        {activeFilter && (
          <p className="subtitle">
            Menampilkan hasil berdasarkan{" "}
            <strong>
              {activeFilter === "category"
                ? "Kategori"
                : activeFilter === "area"
                  ? "Negara"
                  : "Pencarian"}
              : {filterName}
            </strong>
          </p>
        )}

        {/* ⚙️ Loading & Error */}
        {loading && <p className="status">Memuat data...</p>}
        {error && <p className="status error">{error}</p>}

        {/* 🧾 Daftar resep */}
        <section className="cardContainer">
          {!loading && meals.length > 0
            ? meals.map(
                ({ idMeal, strMeal, strMealThumb, strCategory, strArea }) => (
                  <Card
                    key={idMeal}
                    data={strMeal}
                    image={strMealThumb}
                    category={strCategory || "Tidak diketahui"}
                    area={strArea || "Tidak diketahui"}
                    onClick={() => handleCardClick(idMeal)}
                  />
                ),
              )
            : !loading && (
                <p
                  className="status"
                  style={{
                    fontSize: "1.5vw",
                    color: "#555",
                    textAlign: "center",
                    marginLeft: "41vw",
                  }}
                >
                  {" "}
                  Resep tidak ditemukan.
                </p>
              )}
        </section>
      </main>

      {/* 💬 Modal Detail */}
      {modalOpen && modalMeal && (
        <FloatWindow title={modalMeal.strMeal} onClose={handleCloseModal}>
          <img
            src={modalMeal.strMealThumb}
            alt={modalMeal.strMeal}
            style={{ width: "20%", borderRadius: "10px" }}
          />
          <p>
            <strong>Kategori:</strong> {modalMeal.strCategory}
          </p>
          <p>
            <strong>Area:</strong> {modalMeal.strArea}
          </p>

          <h4>Bahan:</h4>
          <ul>
            {Array.from({ length: 20 }, (_, i) => i + 1)
              .map((i) => ({
                ingredient: modalMeal[`strIngredient${i}`],
                measure: modalMeal[`strMeasure${i}`],
              }))
              .filter(({ ingredient }) => ingredient)
              .map(({ ingredient, measure }, idx) => (
                <li key={idx}>
                  {ingredient} — {measure}
                </li>
              ))}
          </ul>

          <h3>Instruksi:</h3>
          <p style={{ whiteSpace: "pre-line" }}>{modalMeal.strInstructions}</p>
        </FloatWindow>
      )}

      {/* 👣 Footer */}
      <Footer />
    </div>
  );
}
