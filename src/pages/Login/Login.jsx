import React, { useEffect, useRef } from "react";
import "./Login.css";

export default function Login() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const registerBtn = container.querySelector("#register");
    const loginBtn = container.querySelector("#login");

    const handleRegister = () => container.classList.add("active");
    const handleLogin = () => container.classList.remove("active");

    registerBtn.addEventListener("click", handleRegister);
    loginBtn.addEventListener("click", handleLogin);

    return () => {
      registerBtn.removeEventListener("click", handleRegister);
      loginBtn.removeEventListener("click", handleLogin);
    };
  }, []);

  return (
    <div className="login-wrapper">
      <div className="login-container" ref={containerRef}>
        {/* ===== Registro ===== */}
        <div className="login-form-container login-sign-up">
          <form>
            <h1>Crear Cuenta</h1>
            <span>Usa tu correo para registrarte</span>
            <input type="text" placeholder="Nombre" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Contraseña" />
            <button>Registrarte</button>

            {/* Solo visible en móvil */}
            <p className="login-mobile-link">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="#"
                id="login-mobile"
                onClick={(e) => {
                  e.preventDefault();
                  containerRef.current.classList.remove("active");
                }}
              >
                Inicia sesión
              </a>
            </p>
          </form>
        </div>

        {/* ===== Inicio de sesión ===== */}
        <div className="login-form-container login-sign-in">
          <form>
            <h1>Iniciar Sesión</h1>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Contraseña" />
            <button>Ingresar</button>

            {/* Solo visible en móvil */}
            <p className="login-mobile-link">
              ¿No tienes cuenta?{" "}
              <a
                href="#"
                id="register-mobile"
                onClick={(e) => {
                  e.preventDefault();
                  containerRef.current.classList.add("active");
                }}
              >
                Regístrate
              </a>
            </p>
          </form>
        </div>

        {/* ===== Panel deslizante ===== */}
        <div className="login-toggle-container">
          <div className="login-toggle">
            <div className="login-toggle-panel login-toggle-left">
              <h1>Bienvenido!</h1>
              <p>
                Introduce tus datos personales para utilizar todas las funciones
                del sitio web.
              </p>
              <button className="login-hidden" id="login">
                Inicia Sesión
              </button>
            </div>
            <div className="login-toggle-panel login-toggle-right">
              <h1>Hola amigo!</h1>
              <p>
                Regístrate con tus datos personales para utilizar todas las
                funciones del sitio web.
              </p>
              <button className="login-hidden" id="register">
                Regístrate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
