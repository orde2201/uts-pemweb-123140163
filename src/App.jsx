import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import foodImage from "./assets/makanan.png";
import Card from "./component/DetailCard.jsx";
import Header from "./component/Header.jsx";
import FloatWindow from "./component/floatwindow.jsx";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [modalMeal, setModalMeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  useEffect(() => {
    // Ambil random awal
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
      if (res.data.meals) setMeals(res.data.meals);
      else setMeals([]);
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
      setMeals(res.data.meals || []);
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
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error("Error filter area:", err);
      setMeals([]);
    }
  };

  const handleRandomClick = async () => {
    try {
      const res = await axios.get(`${BASE_URL}random.php`);
      const meal = res.data.meals[0];
      // buka modal random detail
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
        <article className="cardContainer">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <Card
                key={meal.idMeal}
                data={meal.strMeal}
                image={meal.strMealThumb}
                onClick={() => handleCardClick(meal.idMeal)}
              />
            ))
          ) : (
            <p>Resep tidak ditemukan.</p>
          )}
        </article>
      </section>

      {modalOpen && modalMeal && (
        <FloatWindow title={modalMeal.strMeal} onClose={handleCloseModal}>
          <img
            src={modalMeal.strMealThumb}
            alt={modalMeal.strMeal}
            style={{ width: "100%", borderRadius: "10px" }}
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
    </div>
  );
}
