import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      {/* Col 1: Imagen */}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Col 2: Info */}
      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p><strong>MARCA:</strong> {product.brand}</p>
        <p><strong>Categoría:</strong> {product.category}</p>
        <p className="rating">
          <strong>Calificación:</strong> <span className="star">⭐</span> {product.rating}
        </p>
        <p className="product-price">${product.price.toLocaleString()}</p>
      </div>

      {/* Col 3: Acciones */}
      <div className="product-actions">
        <p className="buy-line">
          <strong>Cómpralo aquí:</strong><br />{" "}
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="buy-link"
          >
            Visitar tienda
          </a>
        </p>

        <button className="details-btn">Detalles</button>
      </div>
    </div>
  );
}
