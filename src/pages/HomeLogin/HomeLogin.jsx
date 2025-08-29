import "./HomeLogin.css";
import "../Styles/global.css";
import { useRef, useEffect, useState  } from "react";
import { Link } from "react-router-dom";
import Chatbot from "../../components/Chatbot";


export default function HomeLogin() {

  const subMenuRef = useRef(null);

  const toggleMenu = () => {
    subMenuRef.current.classList.toggle("open-menu");
  };

  return (
    <div className="home">
      <input type="checkbox" id="check" />
        <div className="navbar__topbar">
                <div className="container">
                    <p className="navbar__welcome">Bienvenido al eCommerce online de Arryn store</p>
                </div>
        </div>
        <nav className="navbar-home">
            <div className="icon">
                <Link to="/homeLogin">
                    <img src="/src/assets/logo.svg" alt="Arryn logo" />
                </Link>
            </div>
            <div className="search_box">
                <input type="search" placeholder="Busca aquí" />
                <span className="fa fa-search"></span>
            </div>
            <ol>
                <li><Link to="/homeLogin">Inicio</Link></li>
                <li><Link to="/product">Productos</Link></li>            
                <li className="user-desktop">
                  <img src="/src/assets/user.svg" className="user-pick" onClick={toggleMenu} role="button"/>
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
                    
                      <Link to="profile" className="sub-menu-link">
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
      
      <Chatbot />

      {/* First group of images */}
      <div className="img_container1">
        <div className="imagen grande">
          <img src="/src/assets/decoration1.webp" />
        </div>
        <div className="columna-pequena">
          <div className="imagen pequena">
            <img src="/src/assets/decoration2.webp" />
          </div>
          <div className="imagen pequena">
            <img src="/src/assets/decoration3.webp" />
          </div>
        </div>
      </div>
      

      

      {/* Category buttons */}
      <div className="category-container">
        <Link to="/products/televisores" className="category-item">
          <img src="/src/assets/arryntv.webp" alt="Televisores" />
        </Link>
        <Link to="/products/computadoras" className="category-item">
          <img src="/src/assets/arryncomputadoras.webp" alt="Computadoras" />
        </Link>
        <Link to="/products/celulares" className="category-item">
          <img src="/src/assets/arryncel.webp" alt="Celulares" />
        </Link>
      </div>

      {/* Info icons section */}
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

      {/* Info Section estilo presentación */}
      <div className="info-section">
        <div className="info-image">
          <img src="/src/assets/workerarryn.webp" alt="Presentador Arryn" />
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

      {/* Text paragraph */}

      <h2 class="pulse-title">
        Más que productos, ofrecemos soluciones que mejoran tu vida.<br />
        Explora nuestras novedades y encuentra lo que necesitas.
      </h2>




      {/* Second group of images */}
      <div className="img_container2">
        <div className="img">
          <img src="/src/assets/decoration4.webp" alt="Apple card" />
        </div>
        <div className="img">
          <img src="/src/assets/decoration5.webp" alt="Xiaomi card" />
        </div>
      </div>

      <footer className="footer">
        <p className="footer__text">© 2025 Arryn | Todos los derechos reservados.</p>
      </footer>

    
    </div>
    
  );
}
