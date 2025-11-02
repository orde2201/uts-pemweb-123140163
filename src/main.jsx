import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Admin from "./page/admin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Halaman utama */}
        <Route path="/" element={<App />} />

        {/* Halaman admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  </StrictMode>,
);
