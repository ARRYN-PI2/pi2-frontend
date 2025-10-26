import { useEffect, useState } from "react";
import "./ProductCard.css";
import ProductModal from "./ProductModal";
import apiClient from "../services/api";

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);
  const [extraDetails, setExtraDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");

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

  useEffect(() => {
    let ignore = false;

    if (!showModal) {
      setExtraDetails(null);
      setDetailsError("");
      setIsLoadingDetails(false);
      return () => {
        ignore = true;
      };
    }

    if (!product?._id || product?.detalles_adicionales) {
      setExtraDetails(null);
      setDetailsError("");
      setIsLoadingDetails(false);
      return () => {
        ignore = true;
      };
    }

    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      setDetailsError("");

      try {
        const data = await apiClient.getOfferDetails(product._id);
        if (!ignore) {
          setExtraDetails(data);
        }
      } catch (err) {
        if (!ignore) {
          setDetailsError(
            err?.message || "No se pudieron cargar los detalles."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchDetails();

    return () => {
      ignore = true;
    };
  }, [showModal, product]);

  return (
    <div className="product-card" data-testid="product-card">
      {/* Col 1: Imagen */}
      <div className="product-image">
        <img
          src={imagen}
          alt={nombre}
          onError={(e) => {
            e.currentTarget.src = "/src/assets/placeholder-product.webp";
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

 
        <button
          className="details-btn"
          onClick={() => setShowModal(true)}
        >
          Detalles
        </button>
      </div>

 
      {showModal && (
        <ProductModal
          product={product}
          extraDetails={extraDetails}
          loadingDetails={isLoadingDetails}
          detailsError={detailsError}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
