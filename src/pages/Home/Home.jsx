import "./Home.css";
import "../Styles/global.css";
import { Link } from "react-router-dom";


 
export default function Home() {
  return (
    <div className="home">
      
        <input type="checkbox" id="check" />
        <div className="navbar__topbar">
                <div className="container">
                    <p className="navbar__welcome">Welcome to Arryn online eCommerce store</p>
                </div>
        </div>
        <nav className="navbar-home">
            <div className="icon">
                <Link to="/">
                    <img src="/src/assets/logo.svg" alt="Arryn logo" />
                </Link>
            </div>
            
            <ol>                
                <li><Link to="/login">Login</Link></li>
            </ol>
            <label htmlFor="check" className="bar">
                <span className="fa fa-bars" id="bars"></span>
                <span className="fa fa-times" id="times"></span>
            </label>
        </nav>

        {/* First group of images */}
        <div className= "img_container1">
            <div className="imagen grande">
                <img src="/src/assets/decoration1.webp" />
            </div>
            <div class="columna-pequena">
                <div class="imagen pequena">
                    <img src="/src/assets/decoration2.webp" />
                </div>
                <div class="imagen pequena">
                    <img src="/src/assets/decoration3.webp" />
                </div>
            </div>
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

        {/* Botón debajo del texto */}
        <div className="cta-container">
            <Link to="/login" className="cta-button">
                Sé parte de la experiencia
            </Link>
        </div>



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
            <p className="footer__text">© 2025 Arryn. All rights reserved.</p>
        </footer>
    
    </div> //endl home
  );
}

