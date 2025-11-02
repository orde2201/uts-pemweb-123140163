import "./componentStyle.css";

const DetailCard = ({ data, image, category, area, onClick }) => {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={`Lihat detail resep ${data}`}
    >
      <img src={image} alt={data} className="cardImage" loading="lazy" />
      <h3 id="cardName">{data}</h3>

      {/* Tag kategori dan negara */}
      <div id="tagsCard">
        {category && <h5 className="tags">{category}</h5>}
        {area && <h5 className="tags">{area}</h5>}
      </div>
    </div>
  );
};

export default DetailCard;
