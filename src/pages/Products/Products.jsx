// Products.jsx
import "./Products.css";
import "../Styles/global.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import productsData from "../../data/products.json";
import ProductCard from "../../components/ProductCard";
import Chatbot from "../../components/Chatbot";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // 🔹 Filtros
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 10000000 });
  const [rating, setRating] = useState(0);

  // 🔹 Estados de búsqueda
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchParams] = useSearchParams();
  const subMenuRef = useRef(null);

  const toggleMenu = () => {
    subMenuRef.current.classList.toggle("open-menu");
  };

  // 🔹 Normalizar texto (quita tildes y pasa a minúsculas)
  const normalizeText = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // 🔹 Formato bonito COP
  const formatCOP = (n) =>
    Number(n || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  // 🔹 Cargar productos y categorías únicas
  useEffect(() => {
    setProducts(productsData);

    const uniqueCategories = [
      ...new Set(productsData.map((p) => p.categoria)),
    ];
    setCategories(uniqueCategories);

    // 🟣 calcular límites dinámicos de precios
    const prices = productsData.map((p) => Number(p.precio_valor) || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    setPriceBounds({ min, max });
    setMinPrice(min);
    setMaxPrice(max);
  }, []);

  // 🔹 Leer query params (?category=... & ?search=...)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);

    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
      setSearchInput(search);
    }
  }, [searchParams]);

  // 🔹 Aplicar filtros
  useEffect(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter((p) => p.categoria === category);
    }

    result = result.filter(
      (p) => p.precio_valor >= minPrice && p.precio_valor <= maxPrice
    );

    if (rating === "none") {
      result = result.filter((p) => p.calificacion === "Sin calificacion");
    } else if (typeof rating === "number" && rating > 0) {
      result = result.filter(
        (p) =>
          typeof p.calificacion === "number" && p.calificacion >= rating
      );
    }

    if (searchTerm.trim() !== "") {
      const term = normalizeText(searchTerm);
      result = result.filter(
        (p) =>
          normalizeText(p.titulo).includes(term) ||
          normalizeText(p.categoria).includes(term) ||
          normalizeText(p.marca).includes(term)
      );
    }

    result.sort((a, b) => b.precio_valor - a.precio_valor);
    setFilteredProducts(result);

    setCurrentPage(1);
  }, [products, category, minPrice, maxPrice, rating, searchTerm]);

  // 🔹 Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="products-page">
      {/* 🔹 Navbar superior */}
      <input type="checkbox" id="check" />
      <div className="navbar__topbar">
        <div className="container">
          <p className="navbar__welcome">
            Bienvenido al eCommerce online de Arryn store
          </p>
        </div>
      </div>

      <nav className="navbar-home">
        <div className="icon">
          <Link to="/homeLogin">
            <img src="/src/assets/logo.svg" alt="Arryn logo" />
          </Link>
        </div>

        {/* 🔹 Caja de búsqueda */}
        <div className="search_box">
          <input
            type="search"
            placeholder="Busca aquí"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(searchInput); // aplica filtro con Enter
              }
            }}
          />
          <span
            className="fa fa-search"
            role="button"
            onClick={() => setSearchTerm(searchInput)}
          ></span>
        </div>

        <ol>
          <li><Link to="/homeLogin">Inicio</Link></li>
          <li><Link to="/products">Productos</Link></li>
          <li className="user-desktop">
            <img
              src="/src/assets/user.svg"
              className="user-pick"
              onClick={toggleMenu}
              role="button"
            />
          </li>
          <li className="user-mobile"><Link to="/profile">Editar Perfil</Link></li>
          <li className="user-mobile"><Link to="/logout">Cerrar Sesión</Link></li>

          <div className="sub-menu-wrap" ref={subMenuRef}>
            <div className="sub-menu">
              <div className="user-info">
                <img src="/src/assets/icon.svg" />
                <h3>Bienvenido</h3>
              </div>
              <hr />
              <Link to="/profile" className="sub-menu-link">
                <img src="/src/assets/profile.png" />
                <p>Editar perfil</p>
              </Link>
              <Link to="/logout" className="sub-menu-link">
                <img src="/src/assets/logout.png" />
                <p>Cerrar Sesión</p>
              </Link>
            </div>
          </div>
        </ol>

        <label htmlFor="check" className="bar">
          <span className="fa fa-bars" id="bars"></span>
          <span className="fa fa-times" id="times"></span>
        </label>
      </nav>


      <div className="products-content">
        <aside className="filters-sidebar">
          {/* Categoría */}
          <h3 className="filter-title">CATEGORÍA</h3>
          <div className="filter-group">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Rango de precio */}
          <h3 className="filter-title">RANGO DE PRECIO</h3>
          <div className="filter-group">
            <label htmlFor="minPrice">Mínimo</label>
            <input
              id="minPrice"
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={10000}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />

            <label htmlFor="maxPrice">Máximo</label>
            <input
              id="maxPrice"
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />

            <p>
              Rango: {formatCOP(minPrice)} – {formatCOP(maxPrice)}
            </p>
          </div>

          {/* Calificación */}
          <h3 className="filter-title">CALIFICACIÓN</h3>
          <div className="filter-group">
            <label>
              <input
                type="radio"
                value={0}
                checked={rating === 0}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              Todas
            </label>
            <label>
              <input
                type="radio"
                value="none"
                checked={rating === "none"}
                onChange={(e) => setRating(e.target.value)}
              />
              Sin calificación
            </label>
            <label>
              <input
                type="radio"
                value={3}
                checked={rating === 3}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              ⭐ 3 o más
            </label>
            <label>
              <input
                type="radio"
                value={4}
                checked={rating === 4}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              ⭐ 4 o más
            </label>
            <label>
              <input
                type="radio"
                value={4.9}
                checked={rating === 4.9}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              ⭐ 5
            </label>
          </div>
        </aside>

        <section className="products-main">
          <div className="products-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((p, idx) => (
                <ProductCard key={idx} product={p} />
              ))
            ) : (
              <p>No se encontraron productos</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ◀ Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Siguiente ▶
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
