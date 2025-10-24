// src/components/ProductModal.jsx
import "./ProductModal.css";

export default function ProductModal({
  product,
  extraDetails,
  loadingDetails = false,
  detailsError = "",
  onClose,
}) {
  if (!product) return null;

  const formattedPrice = Number(product.precio_valor ?? product.price ?? 0);
  const detallesAdicionales =
    extraDetails?.detalles_adicionales ??
    product?.detalles_adicionales ??
    "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
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
          <p><strong>Marca:</strong> {product.marca || "Sin marca"}</p>
          <p><strong>Categoría:</strong> {product.categoria || "Sin categoría"}</p>
          <p>
            <strong>Precio:</strong>{" "}
            {formattedPrice
              ? formattedPrice.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                })
              : "Precio no disponible"}
          </p>
          <p><strong>Calificación:</strong> {product.calificacion ?? "N/A"}</p>
          {product.tamaño && <p><strong>Tamaño:</strong> {product.tamaño}</p>}

          <h3>Descripción</h3>
          {loadingDetails ? (
            <p>Cargando detalles...</p>
          ) : detailsError ? (
            <p className="modal-error">{detailsError}</p>
          ) : detallesAdicionales ? (
            <pre className="modal-description">{detallesAdicionales}</pre>
          ) : (
            <p>No hay detalles adicionales para este producto.</p>
          )}

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
