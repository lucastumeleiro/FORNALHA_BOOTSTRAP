export type ProductCategory = "breads" | "sweets" | "drinks";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
};

export const products: Product[] = [
  {
    id: "sourdough",
    name: "Pão de fermentação natural",
    description:
      "Fermento vivo desde 2019 e 36 horas de fermentação até a casca grossa.",
    price: 28,
    category: "breads",
  },
  {
    id: "rye",
    name: "Pão de centeio",
    description:
      "Centeio de miolo denso e sabor firme, bom com manteiga ou queijo.",
    price: 32,
    category: "breads",
  },
  {
    id: "focaccia",
    name: "Focaccia de alecrim",
    description: "Alecrim e azeite por cima, massa alta e borda dourada.",
    price: 24.5,
    category: "breads",
  },
  {
    id: "croissant",
    name: "Croissant de manteiga",
    description: "Camadas finas de manteiga que estalam na primeira mordida.",
    price: 12.5,
    category: "sweets",
  },
  {
    id: "orange-cake",
    name: "Bolo de laranja (fatia)",
    description:
      "Laranja ralada na massa, textura úmida e fatia que pede café.",
    price: 9.9,
    category: "sweets",
  },
  {
    id: "filter-coffee",
    name: "Café coado",
    description: "Coado na hora, passo a passo, e servido quente na xícara.",
    price: 7,
    category: "drinks",
  },
];
