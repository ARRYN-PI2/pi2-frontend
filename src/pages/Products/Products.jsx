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

  // Filtros
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [rating, setRating] = useState(0);

  // 👇 Estados de búsqueda
  const [searchInput, setSearchInput] = useState(""); // lo que escribe el user
  const [searchTerm, setSearchTerm] = useState("");   // lo que activa el filtro

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchParams] = useSearchParams();
  const subMenuRef = useRef(null);

  const toggleMenu = () => {
    subMenuRef.current.classList.toggle("open-menu");
  };

  // 👇 Función para normalizar texto (quita tildes y pasa a minúsculas)
  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Cargar productos y categorías únicas
  useEffect(() => {
    setProducts(productsData);
    const uniqueCategories = [...new Set(productsData.map((p) => p.category))];
    setCategories(uniqueCategories);
  }, []);

  // Leer query params (?category=... & ?search=...)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);

    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
      setSearchInput(search); //lo escribe en la caja también
    }
  }, [searchParams]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (rating > 0) {
      result = result.filter((p) => p.rating >= rating);
    }

    // 👇 Filtro por búsqueda (sin tildes ni mayúsculas)
    if (searchTerm.trim() !== "") {
      const term = normalize(searchTerm);
      result = result.filter(
        (p) =>
          normalize(p.name).includes(term) ||
          normalize(p.brand).includes(term) ||
          normalize(p.category).includes(term)
      );
    }

    result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);

    // Reiniciar a página 1 cada vez que se aplican filtros
    setCurrentPage(1);
  }, [products, category, minPrice, maxPrice, rating, searchTerm]);

  // Productos de la página actual
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  // Número total de páginas
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
                setSearchTerm(searchInput); //aplica filtro con Enter
              }
            }}
          />
          {/* Cuando haces clic en la lupa se aplica el filtro */}
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

      {/* Chatbot */}
      <Chatbot />

      <div className="products-content">
        {/* 🔹 Sidebar de filtros */}
        <aside className="filters-sidebar">
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

          <h3 className="filter-title">RANGO DE PRECIO</h3>
          <div className="filter-group">
            <label htmlFor="minPrice">Mínimo</label>
            <input
              id="minPrice"
              type="range"
              min="0"
              max="10000000"
              step="50000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />

            <label htmlFor="maxPrice">Máximo</label>
            <input
              id="maxPrice"
              type="range"
              min="0"
              max="10000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />

            <p>
              Rango: ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}
            </p>
          </div>



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

        {/* 🔹 Grid de productos */}
        <section className="products-main">
          <div className="products-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p>No se encontraron productos</p>
            )}
          </div>

          {/* 🔹 Controles de paginación */}
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

      <footer className="footer">
        <p className="footer__text">
          © 2025 Arryn | Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
