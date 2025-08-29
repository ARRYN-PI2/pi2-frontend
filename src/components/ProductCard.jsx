import "./ProductCard.css";

export default function ProductCard() {
  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src="https://via.placeholder.com/300x200"
          alt="Imagen producto"
        />
      </div>
      <div className="product-info">
        <h2 className="product-title">
          Computador Portátil ACER ASPIRE LITE 15.6" - AMD Ryzen 7 - 16GB RAM - 1TB SSD
        </h2>

        <ul className="specs">
          <li><strong>Capacidad de Disco:</strong> SSD 1TB</li>
          <li><strong>Procesador:</strong> AMD Ryzen 7</li>
          <li><strong>Memoria RAM:</strong> 16 GB</li>
          <li><strong>Tamaño Pantalla:</strong> 15.6"</li>
        </ul>

        <div className="price">
          <span className="current-price">$2.349.000</span>
        </div>
      </div>
    </div>
  );
}

{/* poner esto cuando vayamos a poner productos:
    
    import ProductCard from "../../components/ProductCard";
          <ProductCard />
  
  */}