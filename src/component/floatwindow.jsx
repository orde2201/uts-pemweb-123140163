import { useEffect } from "react";
import "./componentStyle.css";
export default function FloatWindow({ title, children, onClose }) {
  // 🔒 Mencegah scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden"; // nonaktifkan scroll body
    return () => {
      document.body.style.overflow = "auto"; // aktifkan lagi saat modal ditutup
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // biar klik dalam modal tidak menutup
      >
        {title && <h2 className="modal-title">{title}</h2>}

        {/* isi yang bisa di-scroll */}
        <div className="modal-body">{children}</div>

        <button className="close-btn" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
