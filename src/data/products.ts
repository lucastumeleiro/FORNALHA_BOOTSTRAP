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
    description: "Descrição em breve.",
    price: 28,
    category: "breads",
  },
  {
    id: "rye",
    name: "Pão de centeio",
    description: "Descrição em breve.",
    price: 32,
    category: "breads",
  },
  {
    id: "focaccia",
    name: "Focaccia de alecrim",
    description: "Descrição em breve.",
    price: 24.5,
    category: "breads",
  },
  {
    id: "croissant",
    name: "Croissant de manteiga",
    description: "Descrição em breve.",
    price: 12.5,
    category: "sweets",
  },
  {
    id: "orange-cake",
    name: "Bolo de laranja (fatia)",
    description: "Descrição em breve.",
    price: 9.9,
    category: "sweets",
  },
  {
    id: "filter-coffee",
    name: "Café coado",
    description: "Descrição em breve.",
    price: 7,
    category: "drinks",
  },
];
