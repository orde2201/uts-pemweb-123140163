import React from "react";
import "./componentStyle.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 Yoga. All rights reserved.</p>
        <p>
          Instagram:{" "}
          <a
            href="https://instagram.com/yoga_pepsodent"
            target="_blank"
            rel="noopener noreferrer"
          >
            @yoga_pepsodent
          </a>
        </p>
      </div>
    </footer>
  );
}
