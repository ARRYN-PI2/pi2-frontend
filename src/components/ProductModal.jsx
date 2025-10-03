// src/components/ProductModal.jsx
import "./ProductModal.css";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // evitar cerrar al hacer click dentro
      >
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        <div className="modal-header">
          <img
            src={product.imagen || "/src/assets/default.png"}
            alt={product.titulo}
          />
          <h2>{product.titulo}</h2>
        </div>

        <div className="modal-body">
          <p><strong>Marca:</strong> {product.marca}</p>
          <p><strong>Categoría:</strong> {product.categoria}</p>
          <p>
            <strong>Precio:</strong>{" "}
            {Number(product.precio_valor).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            })}
          </p>
          <p><strong>Calificación:</strong> {product.calificacion}</p>
          <p><strong>Tamaño:</strong> {product.tamaño}</p>

          <h3>Descripción</h3>
          <pre className="modal-description">{product.detalles_adicionales}</pre>

          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-link"
          >
            Ver producto en la tienda
          </a>
        </div>
      </div>
    </div>
  );
}
