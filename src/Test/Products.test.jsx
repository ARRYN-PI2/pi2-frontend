import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Products from "../pages/Products/Products";
import productsData from "../data/products.json";

describe("Products Component", () => {
test("renderiza 5 productos en la primera página", () => {
  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

  const cards = screen.getAllByTestId("product-card");
  expect(cards).toHaveLength(5);
});


  test("filtra productos por categoría", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const categorySelect = screen.getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: "celulares" } });

    const celulares = productsData.filter(p => p.category === "celulares");

    celulares.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  test("filtra productos por rango de precio", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const minInput = screen.getByLabelText(/Mínimo/i);
    const maxInput = screen.getByLabelText(/Máximo/i);

    fireEvent.change(minInput, { target: { value: "500000" } });
    fireEvent.change(maxInput, { target: { value: "1000000" } });

    const filtrados = productsData.filter(
      p => p.price >= 500000 && p.price <= 1000000
    );

    filtrados.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
