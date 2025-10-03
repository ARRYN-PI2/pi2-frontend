import "./ProductCard.css";

export default function ProductCard({ product }) {
  // Fallbacks por si faltan datos
  const nombre = product?.titulo || product?.name || "Producto sin nombre";
  const marca = product?.marca || product?.brand || "Sin marca";
  const categoria = product?.categoria || product?.category || "Sin categoría";
  const calificacion = product?.calificacion || product?.rating || "N/A";
  const precio =
    product?.precio_valor ??
    product?.price ??
    null;
  const imagen = product?.imagen || product?.image;
  const link = product?.link || "#";

  return (
    <div className="product-card" data-testid="product-card">
      {/* Col 1: Imagen */}
      <div className="product-image">
        <img
          src={imagen}
          alt={nombre}
          onError={(e) => {
            e.currentTarget.src = "/src/assets/placeholder-product.png";
          }}
        />
      </div>

      {/* Col 2: Info */}
      <div className="product-info">
        <h2 className="product-name">{nombre}</h2>
        <p><strong>MARCA:</strong> {marca}</p>
        <p><strong>Categoría:</strong> {categoria}</p>
        <p className="rating">
          <strong>Calificación:</strong> <span className="star">⭐</span> {calificacion}
        </p>
        <p className="product-price">
          {precio !== null
            ? precio.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })
            : "Precio no disponible"}
        </p>
      </div>

      {/* Col 3: Acciones */}
      <div className="product-actions">
        <p className="buy-line">
          <strong>Cómpralo aquí:</strong><br />
          <a
            href={link}
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
