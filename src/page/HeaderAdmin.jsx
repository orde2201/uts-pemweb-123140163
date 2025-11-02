// src/component/HeaderAdmin.jsx
import "./admin.css";

export default function HeaderAdmin() {
  return (
    <header className="header">
      {/* Logo sama seperti versi utama */}
      <div className="logo" style={{ justifyContent: "center" }}>
        🍳 <span>Dapoerku</span>
      </div>
    </header>
  );
}
