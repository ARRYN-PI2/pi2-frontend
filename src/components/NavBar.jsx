// src/components/NavBar.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();

    if (!query) return;

    if (location.pathname.includes("/products")) {
      // 🔹 Si ya estamos en Products, filtra directamente
      if (onSearch) onSearch(query);
    } else {
      // 🔹 Si estamos en HomeLogin, redirige a /products con query param
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="/home-login" className="logo">
          Arryn
        </a>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <div className="nav-right">
        <a href="/products">Productos</a>
        <a href="/about">Acerca</a>
      </div>
    </nav>
  );
}
