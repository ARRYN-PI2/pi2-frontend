import "./HomeLogin.css";
import "../Styles/global.css";
import "../Styles/DarkMode.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chatbot from "../../components/ChatBot";


import logo from "../../assets/Logo.svg";
import userIcon from "../../assets/user.svg";
import icon from "../../assets/icon.svg";
import profile from "../../assets/profile.png";
import logoutIcon from "../../assets/logout.png";
import decoration1 from "../../assets/decoration1.webp";
import decoration2 from "../../assets/decoration2.webp";
import decoration3 from "../../assets/decoration3.webp";
import decoration4 from "../../assets/decoration4.webp";
import decoration5 from "../../assets/decoration5.webp";
import workerArryn from "../../assets/workerarryn.webp";
import arrynTv from "../../assets/arryntv.webp";
import arrynComputadoras from "/src/assets/arryncomputadoras.webp";
import arrynCel from "../../assets/arryncel.webp";

export default function HomeLogin() {
  const subMenuRef = useRef(null);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleMenu = () => {
    if (subMenuRef.current) subMenuRef.current.classList.toggle("open-menu");
  };

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`);
    } else {
      navigate("/products");
    }
  };

  const goToCategory = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  const handleEditClick = (e) => {
    if (e) e.preventDefault();
    setShowPopup(true);
  };

  const handleModeChange = (mode) => {
    setDarkMode(mode === "dark");
    document.body.classList.toggle("dark-mode", mode === "dark");
    setShowPopup(false);
  };

  const handleLogout = () => {
    document.body.classList.remove("dark-mode");
    navigate("/");
  };

  return (
    <div className="home">
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
            <img src={logo} alt="Arryn logo" />
          </Link>
        </div>

        {/* 🔹 Barra de búsqueda */}
        <div className="search_box">
          <input
            type="search"
            placeholder="Busca aquí"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <span
            className="fa fa-search"
            role="button"
            onClick={handleSearch}
          ></span>
        </div>

        <ol>
          <li><Link to="/homeLogin">Inicio</Link></li>
          <li><Link to="/products">Productos</Link></li>
          <li className="user-desktop">
            <img
              src={userIcon}
              className="user-pick"
              onClick={toggleMenu}
              role="button"
              alt="Usuario"
            />
          </li>

          {/* 🔹 Botón Editar Sitio (móvil) */}
          <li className="user-mobile">
            <button className="edit-site-btn" onClick={handleEditClick}>
              🛠️ Editar Sitio
            </button>
          </li>

          {/* 🔹 Botón Cerrar Sesión (móvil) */}
          <li className="user-mobile">
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </li>

          {/* Submenú */}
          <div className="sub-menu-wrap" ref={subMenuRef}>
            <div className="sub-menu">
              <div className="user-info">
                <img src={icon} alt="Icono" />
                <h3>Bienvenido</h3>
              </div>
              <hr />
              <button
                className="sub-menu-link edit-site-btn"
                onClick={handleEditClick}
              >
                <img src={profile} alt="Editar" />
                <p>Editar Sitio</p>
              </button>
              <button
                className="sub-menu-link logout-btn"
                onClick={handleLogout}
              >
                <img src={logoutIcon} alt="Salir" />
                <p>Cerrar Sesión</p>
              </button>
            </div>
          </div>
        </ol>

        <label htmlFor="check" className="bar">
          <span className="fa fa-bars" id="bars"></span>
          <span className="fa fa-times" id="times"></span>
        </label>
      </nav>

      <Chatbot />

      {/* 🔹 Popup modo claro/oscuro */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Personaliza la apariencia</h2>
            <p>Selecciona el modo de visualización:</p>
            <div className="popup-buttons">
              <button onClick={() => handleModeChange("light")}>
                Modo Claro
              </button>
              <button onClick={() => handleModeChange("dark")}>
                Modo Oscuro
              </button>
            </div>
            <button
              className="close-popup"
              onClick={() => setShowPopup(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Imágenes principales */}
      <div className="img_container1">
        <div className="imagen grande">
          <img src={decoration1} alt="Decoración 1" />
        </div>
        <div className="columna-pequena">
          <div className="imagen pequena">
            <img src={decoration2} alt="Decoración 2" />
          </div>
          <div className="imagen pequena">
            <img src={decoration3} alt="Decoración 3" />
          </div>
        </div>
      </div>

      {/* 🔹 Categorías */}
      <div className="category-container">
        <div
          className="category-item"
          role="button"
          onClick={() => goToCategory("Televisores")}
        >
          <img src={arrynTv} alt="Televisores" />
        </div>
        <div
          className="category-item"
          role="button"
          onClick={() => goToCategory("Computadoras")}
        >
          <img src={arrynComputadoras} alt="Computadoras" />
        </div>
        <div
          className="category-item"
          role="button"
          onClick={() => goToCategory("Celulares")}
        >
          <img src={arrynCel} alt="Celulares" />
        </div>
      </div>

      {/* 🔹 Secciones informativas */}
      <div className="arryn-info">
        <div>
          <i className="fas fa-tags"></i>
          <h3>Comparación de Precios</h3>
          <p>Encuentra el mismo producto en varias tiendas y elige la opción más económica.</p>
        </div>
        <div>
          <i className="fas fa-store"></i>
          <h3>Varias Tiendas</h3>
          <p>Explora productos de múltiples tiendas online en un solo lugar.</p>
        </div>
        <div>
          <i className="fas fa-comments"></i>
          <h3>Asesor Virtual</h3>
          <p>Un chatbot inteligente que te ayuda a encontrar justo lo que buscas.</p>
        </div>
        <div>
          <i className="fas fa-shipping-fast"></i>
          <h3>Envíos Rápidos</h3>
          <p>Selecciona productos con los mejores tiempos y costos de envío.</p>
        </div>
        <div>
          <i className="fas fa-user-shield"></i>
          <h3>Compra Segura</h3>
          <p>Te guiamos a tiendas confiables y seguras para tus compras online.</p>
        </div>
        <div>
          <i className="fas fa-star"></i>
          <h3>Productos Recomendados</h3>
          <p>Recibe sugerencias basadas en reseñas y popularidad del mercado.</p>
        </div>
      </div>

      {/* 🔹 Sección informativa con imagen */}
      <div className="info-section">
        <div className="info-image">
          <img src={workerArryn} alt="Presentador Arryn" />
        </div>
        <div className="info-text">
          <h2>
            ¿Quién estará contigo en tu experiencia en{" "}
            <span className="highlight">Arryn?</span>
          </h2>
          <p className="info-subtitle">
            <strong>+20 años de experiencia | Más de 100.000 usuarios satisfechos</strong>
          </p>
          <p>
            En Arryn entendemos lo difícil que puede ser elegir el producto ideal.
            Por eso, te acompañamos paso a paso con herramientas inteligentes, comparaciones de precios
            y un asistente virtual que te ayuda a tomar la mejor decisión.
          </p>
          <p>
            Nuestro objetivo es que tengas claridad, confianza y seguridad en tus compras,
            para transformar tu experiencia online en algo rápido, seguro y confiable.
          </p>
        </div>
      </div>

      {/* 🔹 Texto final */}
      <h2 className="pulse-title">
        Más que productos, ofrecemos soluciones que mejoran tu vida.<br />
        Explora nuestras novedades y encuentra lo que necesitas.
      </h2>

      {/* 🔹 Grupo final de imágenes */}
      <div className="img_container2">
        <div className="img">
          <img src={decoration4} alt="Apple card" />
        </div>
        <div className="img">
          <img src={decoration5} alt="Xiaomi card" />
        </div>
      </div>

      <footer className="footer">
        <p className="footer__text">
          © 2025 Arryn | Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
