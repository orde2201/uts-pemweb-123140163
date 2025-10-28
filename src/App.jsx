import { useEffect } from "react";
import axios from "axios";
import "./App.css";
import foodImage from "./assets/makanan.png";

function MainPage() {
  return <img src={foodImage} id="foodImage" />;
}
function App() {
  useEffect(() => {
    const url = import.meta.env.VITE_API_URL;
    console.log("Fetching:", url);

    axios
      .get(url)
      .then((res) => {
        console.log("Data dari API:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <dev>
      <MainPage />
    </dev>
  );
}

export default App;
