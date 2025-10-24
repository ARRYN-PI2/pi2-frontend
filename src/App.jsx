// src/App.jsx
import "./pages/Styles/global.css";
import Home from "./pages/Home/Home";
import HomeLogin from './pages/HomeLogin/HomeLogin';
import Login from "./pages/Login/Login";
import Products from "../pages/Products/Products";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/homeLogin" element={<HomeLogin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
