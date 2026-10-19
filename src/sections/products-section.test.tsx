import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";
import { productsSectionContent } from "@/content/products-section";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/format-price";
import { ProductsSection } from "@/sections/products-section";

// O Intl separa "R$" do número com U+00A0; o Testing Library normaliza o DOM para espaço comum.
const comoNaTela = (texto: string) => texto.replace(/\s/g, " ");

describe("ProductsSection", () => {
  it("deve mostrar título e subtítulo novos quando a seção renderiza", () => {
    // Arrange
    render(<ProductsSection />);

    // Assert
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: productsSectionContent.title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(productsSectionContent.subtitle)).toBeVisible();
  });

  it("deve mostrar a descrição de cada um dos seis produtos quando a seção renderiza", () => {
    // Arrange
    render(<ProductsSection />);

    // Assert
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    for (const product of products) {
      expect(screen.getByText(product.description)).toBeInTheDocument();
    }
  });

  it("deve mostrar nome, preço e categoria de cada produto quando só a descrição muda", () => {
    // Arrange
    render(<ProductsSection />);

    // Assert
    for (const product of products) {
      expect(
        screen.getByRole("heading", { level: 3, name: product.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(comoNaTela(formatPrice(product.price))),
      ).toBeInTheDocument();
    }
    // Só os badges dos cards: os botões de filtro repetem os mesmos rótulos.
    const badge = { selector: '[data-slot="badge"]' };
    expect(screen.getAllByText("Pães", badge)).toHaveLength(3);
    expect(screen.getAllByText("Doces", badge)).toHaveLength(2);
    expect(screen.getAllByText("Bebidas", badge)).toHaveLength(1);
  });

  it("deve mostrar os preços esperados quando o cardápio renderiza", () => {
    // Arrange
    render(<ProductsSection />);

    // Assert
    const esperados = [
      "R$ 28,00",
      "R$ 32,00",
      "R$ 24,50",
      "R$ 12,50",
      "R$ 9,90",
      "R$ 7,00",
    ];
    for (const preco of esperados) {
      expect(screen.getByText(preco)).toBeInTheDocument();
    }
  });
});

describe("App — cardápio", () => {
  it("deve apagar o texto provisório e o subtítulo antigo da página quando ela renderiza", () => {
    // Arrange
    render(<App />);

    // Assert
    expect(screen.queryByText(/Descrição em breve/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Conheça nossos produtos/i),
    ).not.toBeInTheDocument();
  });
});
