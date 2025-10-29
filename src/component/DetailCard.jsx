import "./componentStyle.css";

// contoh sederhana Card
export default function Card({ data, image, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <img src={image} alt={data} className="cardImage" />
      <h3>{data}</h3>
    </div>
  );
}
