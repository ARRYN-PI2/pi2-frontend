import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import apiClient from "../../services/api";

export default function Login() {
  const containerRef = useRef(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginError, setLoginError] = useState("");

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

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterMessage("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const password = formData.get("password")?.toString().trim();

    if (!username || !email || !password) {
      setRegisterError("Por favor completa todos los campos.");
      return;
    }

    setRegisterLoading(true);

    try {
      const response = await apiClient.createUser({
        username,
        email,
        password,
      });

      setRegisterMessage(
        response?.message || "Usuario registrado correctamente."
      );
      event.currentTarget.reset();
    } catch (err) {
      const payload = err?.payload;
      const backendMessage =
        (payload &&
          Object.values(payload)
            .flat()
            .find(Boolean)) ||
        err?.message;
      setRegisterError(
        backendMessage || "No se pudo completar el registro."
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginMessage("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const password = formData.get("password")?.toString().trim();

    if (!email || !password) {
      setLoginError("Ingresa tu email y contraseña.");
      return;
    }

    setLoginLoading(true);

    try {
      const users = await apiClient.getUsers();
      const userMatch = users.find(
        (u) => u.email?.toLowerCase() === email
      );

      if (!userMatch) {
        setLoginError("Usuario no encontrado. Regístrate primero.");
        return;
      }

      setLoginMessage(
        "Inicio de sesión simulado. Configura autenticación segura en el backend para habilitarlo."
      );
    } catch (err) {
      setLoginError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container" ref={containerRef}>
        {/* ===== Registro ===== */}
        <div className="login-form-container login-sign-up">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Crear Cuenta</h1>
            <span>Usa tu correo para registrarte</span>
            <input name="username" type="text" placeholder="Nombre" />
            <input name="email" type="email" placeholder="Email" />
            <input name="password" type="password" placeholder="Contraseña" />
            <button type="submit" disabled={registerLoading}>
              {registerLoading ? "Registrando..." : "Registrarte"}
            </button>

            {registerMessage && (
              <p className="login-status success">{registerMessage}</p>
            )}
            {registerError && (
              <p className="login-status error">{registerError}</p>
            )}

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
          <form onSubmit={handleLoginSubmit}>
            <h1>Iniciar Sesión</h1>
            <input name="email" type="email" placeholder="Email" />
            <input name="password" type="password" placeholder="Contraseña" />
            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Validando..." : "Ingresar"}
            </button>

            {loginMessage && (
              <p className="login-status success">{loginMessage}</p>
            )}
            {loginError && (
              <p className="login-status error">{loginError}</p>
            )}

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
