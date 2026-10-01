import { describe, expect, it } from "vitest";
import { products } from "@/data/products";

const contarPalavras = (texto: string) => texto.trim().split(/\s+/).length;

const descricoes = products.map((product) => product.description);
const todasJuntas = descricoes.join(" ").toLowerCase();

describe("products — descrição", () => {
  it("deve ter de 8 a 18 palavras em cada descrição quando contadas por token separado por espaço", () => {
    // Arrange
    const contagens = products.map((product) => ({
      id: product.id,
      palavras: contarPalavras(product.description),
    }));

    // Assert
    for (const { id, palavras } of contagens) {
      expect(palavras, `descrição de ${id}`).toBeGreaterThanOrEqual(8);
      expect(palavras, `descrição de ${id}`).toBeLessThanOrEqual(18);
    }
  });

  it("deve contar números e pontuação colada como parte da palavra quando a descrição tem vírgula ou número", () => {
    // Act
    const contagens = descricoes.map(contarPalavras);

    // Assert
    expect(contagens).toEqual([13, 12, 10, 9, 11, 11]);
  });

  it("deve citar o detalhe do próprio produto quando cada descrição é lida com o id do seu produto", () => {
    // Arrange
    const termosChave: Record<string, RegExp> = {
      sourdough: /desde 2019/i,
      rye: /centeio/i,
      focaccia: /alecrim/i,
      croissant: /manteiga/i,
      "orange-cake": /laranja/i,
      "filter-coffee": /coad/i,
    };

    // Assert
    expect(Object.keys(termosChave)).toEqual(
      products.map((product) => product.id),
    );
    for (const product of products) {
      expect(product.description, `descrição de ${product.id}`).toMatch(
        termosChave[product.id],
      );
    }
  });

  it("deve trocar o texto provisório quando o cardápio é carregado", () => {
    // Assert
    for (const product of products) {
      expect(product.description.trim()).not.toBe("");
      expect(product.description).not.toMatch(/em breve/i);
    }
  });

  it("deve abrir cada descrição com uma palavra diferente quando o conjunto é lido em sequência", () => {
    // Arrange
    const aberturas = descricoes.map((descricao) =>
      descricao.trim().split(/\s+/)[0].toLowerCase(),
    );

    // Assert
    expect(new Set(aberturas).size).toBe(descricoes.length);
    expect(aberturas).not.toContain("feito");
  });

  it("deve evitar superlativo vazio, emoji e exclamação quando a copy é escrita", () => {
    // Assert
    // radicais: pegam feminino, plural e "-íssimo" (ex.: "perfeita", "deliciosas", "saborosíssima")
    expect(todasJuntas).not.toMatch(
      /melhor|incr[ií]ve|delicios|perfeit|irresist[ií]ve|maravilhos|[ií]ssim/,
    );
    expect(todasJuntas).not.toContain("!");
    expect(todasJuntas).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it("deve citar 36 horas só no pão de fermentação natural quando o fato da marca entra na copy", () => {
    // Arrange
    const comTrintaESeis = products
      .filter((product) => /36 horas/.test(product.description))
      .map((product) => product.id);

    // Assert
    expect(comTrintaESeis).toEqual(["sourdough"]);
  });

  it("deve repetir 'miolo' e 'úmida' exatamente uma vez quando o vocabulário do conjunto é comparado", () => {
    // Assert
    expect(todasJuntas.match(/miolo/g) ?? []).toHaveLength(1);
    expect(todasJuntas.match(/úmid/g) ?? []).toHaveLength(1);
  });

  it("deve evitar fato fora da marca quando a copy fala de farinha, origem, torra ou horário", () => {
    // Assert
    expect(todasJuntas).not.toMatch(/farinha|moinho|origem|torra|fornecedor/);
    // "36 horas" de fermentação é fato da marca permitido (só no sourdough, teste acima); o resto não pode ter horário
    const semFermentacao = todasJuntas.replace(/36 horas/g, "");
    expect(semFermentacao).not.toMatch(/\b\d{1,2}\s?(h|horas?)(?![a-zà-ú])/);
  });
});

describe("products — dados que a copy não pode alterar", () => {
  it("deve manter id, nome, preço e categoria dos seis produtos quando só a descrição muda", () => {
    // Arrange
    const semDescricao = products.map(({ id, name, price, category }) => ({
      id,
      name,
      price,
      category,
    }));

    // Assert
    expect(semDescricao).toEqual([
      {
        id: "sourdough",
        name: "Pão de fermentação natural",
        price: 28,
        category: "breads",
      },
      { id: "rye", name: "Pão de centeio", price: 32, category: "breads" },
      {
        id: "focaccia",
        name: "Focaccia de alecrim",
        price: 24.5,
        category: "breads",
      },
      {
        id: "croissant",
        name: "Croissant de manteiga",
        price: 12.5,
        category: "sweets",
      },
      {
        id: "orange-cake",
        name: "Bolo de laranja (fatia)",
        price: 9.9,
        category: "sweets",
      },
      {
        id: "filter-coffee",
        name: "Café coado",
        price: 7,
        category: "drinks",
      },
    ]);
  });

  it("deve expor só id, name, description, price e category quando um produto é lido", () => {
    // Assert
    for (const product of products) {
      expect(Object.keys(product).sort()).toEqual([
        "category",
        "description",
        "id",
        "name",
        "price",
      ]);
    }
  });
});
