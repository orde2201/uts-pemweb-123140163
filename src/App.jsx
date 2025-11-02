import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import foodImage from "./assets/makanan.png";
import Card from "./component/DetailCard.jsx";
import Header from "./component/Header.jsx";
import FloatWindow from "./component/floatwindow.jsx";
import Footer from "./component/footer";
import Admin from "./page/admin.jsx";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [modalMeal, setModalMeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(""); // bisa "category" atau "area"
  const [filterName, setFilterName] = useState(""); // nama kategori / negara
  const BASE_URL = import.meta.env.VITE_API_URL;

  // ambil random saat awal
  useEffect(() => {
    const fetchRandom = async () => {
      try {
        const promises = Array(4)
          .fill(null)
          .map(() => axios.get(`${BASE_URL}random.php`));
        const responses = await Promise.all(promises);
        const data = responses.map((res) => res.data.meals[0]);
        setMeals(data);
      } catch (err) {
        console.error("Error fetch random:", err);
      }
    };
    fetchRandom();
  }, []);

  const handleSearch = async (term) => {
    if (!term) {
      setMeals([]);
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}search.php?s=${encodeURIComponent(term)}`,
      );
      setMeals(res.data.meals || []);
      setActiveFilter("search");
      setFilterName(term);
    } catch (err) {
      console.error("Error search:", err);
      setMeals([]);
    }
  };

  const handleFilterCategory = async (category) => {
    if (!category) {
      setMeals([]);
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}filter.php?c=${encodeURIComponent(category)}`,
      );
      const mealList = res.data.meals || [];

      // Ambil detail setiap resep agar punya kategori & area lengkap
      const detailedMeals = await Promise.all(
        mealList.slice(0, 10).map(async (m) => {
          const detailRes = await axios.get(
            `${BASE_URL}lookup.php?i=${m.idMeal}`,
          );
          return detailRes.data.meals[0];
        }),
      );

      setMeals(detailedMeals);
      setActiveFilter("category");
      setFilterName(category);
    } catch (err) {
      console.error("Error filter category:", err);
      setMeals([]);
    }
  };

  const handleFilterArea = async (area) => {
    if (!area) {
      setMeals([]);
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}filter.php?a=${encodeURIComponent(area)}`,
      );
      const mealList = res.data.meals || [];

      // Ambil detail setiap resep agar punya kategori & area lengkap
      const detailedMeals = await Promise.all(
        mealList.slice(0, 10).map(async (m) => {
          const detailRes = await axios.get(
            `${BASE_URL}lookup.php?i=${m.idMeal}`,
          );
          return detailRes.data.meals[0];
        }),
      );

      setMeals(detailedMeals);
      setActiveFilter("area");
      setFilterName(area);
    } catch (err) {
      console.error("Error filter area:", err);
      setMeals([]);
    }
  };

  const handleRandomClick = async () => {
    try {
      const res = await axios.get(`${BASE_URL}random.php`);
      const meal = res.data.meals[0];
      setModalMeal(meal);
      setModalOpen(true);
    } catch (err) {
      console.error("Error random:", err);
    }
  };

  const handleCardClick = async (mealId) => {
    try {
      const res = await axios.get(`${BASE_URL}lookup.php?i=${mealId}`);
      const meal = res.data.meals[0];
      setModalMeal(meal);
      setModalOpen(true);
    } catch (err) {
      console.error("Error lookup meal:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMeal(null);
  };

  return (
    <div>
      <Header
        onSearch={handleSearch}
        onFilterCategory={handleFilterCategory}
        onFilterArea={handleFilterArea}
        onRandomClick={handleRandomClick}
      />

      <section>
        <img src={foodImage} id="foodImage" alt="Food" />
        <h1
          style={{
            marginLeft: "40%",
            justifyContent: "center",
            color: "#555",
            fontSize: "5vw",
            marginTop: "9vw",
          }}
        >
          Recipe
        </h1>
        {activeFilter && (
          <p
            style={{
              marginLeft: "3.5vw",
              color: "#555",
              fontSize: "2vw",
              marginTop: "1vw",
            }}
          >
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

        <article className="cardContainer">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <Card
                key={meal.idMeal}
                data={meal.strMeal}
                image={meal.strMealThumb}
                category={meal.strCategory || "Tidak diketahui"}
                area={meal.strArea || "Tidak diketahui"}
                onClick={() => handleCardClick(meal.idMeal)}
              />
            ))
          ) : (
            <p
              style={{
                marginLeft: "3.5vw",
                color: "#555",
                fontSize: "3vw",
                marginTop: "5vw",
              }}
            >
              Resep tidak ditemukan.
            </p>
          )}
        </article>
      </section>

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
              .filter((item) => item.ingredient)
              .map((item, idx) => (
                <li key={idx}>
                  {item.ingredient} — {item.measure}
                </li>
              ))}
          </ul>
          <h3>Instruksi:</h3>
          <p>{modalMeal.strInstructions}</p>
        </FloatWindow>
      )}
      <Footer />
    </div>
  );
}
