import type { CategoryId, MenuItem, ProductSetup, StationId } from "./types";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "combos", label: "Combos" },
  { id: "comida", label: "Comida" },
  { id: "bebidas", label: "Bebidas" },
  { id: "postres", label: "Postres" },
];

export const stations: { id: StationId; label: string }[] = [
  { id: "cocina", label: "Cocina" },
  { id: "barra", label: "Barra" },
  { id: "postres", label: "Postres" },
];

export const menu: MenuItem[] = [
  {
    id: "combo-almuerzo",
    name: "Combo almuerzo",
    price: 189,
    category: "combos",
    station: "cocina",
    detail: "Hamburguesa, papas y bebida.",
  },
  {
    id: "combo-familiar",
    name: "Combo familiar",
    price: 349,
    category: "combos",
    station: "cocina",
    detail: "Cuatro tacos, dos bebidas y un postre.",
  },
  {
    id: "combo-barra",
    name: "Combo barra",
    price: 129,
    category: "combos",
    station: "barra",
    detail: "Café americano y pastel del día.",
  },
  {
    id: "hamburguesa",
    name: "Hamburguesa",
    price: 145,
    category: "comida",
    station: "cocina",
    detail: "Carne, queso y pan brioche.",
  },
  {
    id: "tacos",
    name: "Tacos de pastor",
    price: 98,
    category: "comida",
    station: "cocina",
    detail: "Orden de tres, con cebolla y cilantro.",
  },
  {
    id: "bowl",
    name: "Bowl verde",
    price: 132,
    category: "comida",
    station: "cocina",
    detail: "Arroz, pollo y verdura.",
  },
  {
    id: "quesadilla",
    name: "Quesadilla",
    price: 86,
    category: "comida",
    station: "cocina",
    detail: "Queso y tortilla de maíz.",
  },
  {
    id: "cafe",
    name: "Café americano",
    price: 42,
    category: "bebidas",
    station: "barra",
    detail: "Taza de 250 ml.",
  },
  {
    id: "limonada",
    name: "Limonada",
    price: 46,
    category: "bebidas",
    station: "barra",
    detail: "Vaso con hielo.",
  },
  {
    id: "agua",
    name: "Agua mineral",
    price: 32,
    category: "bebidas",
    station: "barra",
    detail: "Botella de 355 ml.",
  },
  {
    id: "cerveza",
    name: "Cerveza",
    price: 68,
    category: "bebidas",
    station: "barra",
    detail: "Botella de 355 ml.",
  },
  {
    id: "pastel",
    name: "Pastel de chocolate",
    price: 76,
    category: "postres",
    station: "postres",
    detail: "Rebanada individual.",
  },
  {
    id: "helado",
    name: "Helado",
    price: 54,
    category: "postres",
    station: "postres",
    detail: "Dos bolas. Preguntar sabor.",
  },
];

export const menuById = new Map(menu.map((item) => [item.id, item]));

export const tables = ["Mesa 1", "Mesa 4", "Mesa 7", "Mesa 12", "Barra"];

export const quickNotes = ["Sin cebolla", "Extra salsa", "Sin hielo", "Para llevar"];

export const categoryMedia: Record<CategoryId, string> = {
  combos: "#111111",
  comida: "#7C2D12",
  bebidas: "#1E3A8A",
  postres: "#9D174D",
};

export const stationLabel: Record<StationId, string> = {
  cocina: "Cocina",
  barra: "Barra",
  postres: "Postres",
};

const burgerIngredients = {
  id: "ingredientes",
  mode: "multi" as const,
  options: [
    { id: "tocineta", label: "Tocinetta", extra: 0, defaultSelected: true },
    { id: "tomate", label: "Tomate", extra: 0, defaultSelected: true },
    { id: "cebolla", label: "Cebolla", extra: 0, defaultSelected: true },
    { id: "pepinillos", label: "Pepinillos", extra: 0, defaultSelected: true },
    { id: "lechuga", label: "Lechuga", extra: 0, defaultSelected: true },
    { id: "queso", label: "Queso Amarillo", extra: 0, defaultSelected: true },
    { id: "doble", label: "Doble carne", extra: 3 },
    { id: "sin-salsa", label: "Sin salsa", extra: 0, extraLabel: "+0,0$" },
  ],
};

const drinkSize = {
  id: "tamano",
  mode: "single" as const,
  options: [
    { id: "pequenas", label: "Pequeñas", extra: 0, defaultSelected: true },
    { id: "medianas", label: "Medianas", extra: 1.5 },
    { id: "grandes", label: "Grandes", extra: 2 },
  ],
};

const sauces = {
  id: "salsas",
  mode: "multi" as const,
  options: [
    { id: "mayos", label: "Poc.Mayos", extra: 0 },
    { id: "tom", label: "Poc.Tom", extra: 0 },
    { id: "mozt", label: "Poc.Mozt", extra: 0 },
    { id: "tart", label: "Poc.Tart", extra: 0 },
  ],
};

export const productSetups: Record<string, ProductSetup> = {
  "combo-almuerzo": {
    art: "burger",
    sides: true,
    ingredients: burgerIngredients,
    size: drinkSize,
    sauces,
  },
  "combo-familiar": {
    art: "taco",
    sides: true,
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "pastor", label: "Pastor", extra: 0, defaultSelected: true },
        { id: "cilantro", label: "Cilantro", extra: 0, defaultSelected: true },
        { id: "cebolla", label: "Cebolla", extra: 0, defaultSelected: true },
        { id: "limon", label: "Limón", extra: 0, defaultSelected: true },
        { id: "extra", label: "Orden extra", extra: 4 },
        { id: "sin-salsa", label: "Sin salsa", extra: 0, extraLabel: "+0,0$" },
      ],
    },
    size: drinkSize,
    sauces,
  },
  "combo-barra": {
    art: "coffee",
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "leche", label: "Leche", extra: 0, defaultSelected: true },
        { id: "azucar", label: "Azúcar", extra: 0, defaultSelected: true },
        { id: "hielo", label: "Hielo", extra: 0 },
        { id: "extra-shot", label: "Shot extra", extra: 2 },
      ],
    },
    sauces: {
      id: "salsas",
      mode: "single",
      options: [
        { id: "chocolate", label: "Chocolate", extra: 0, defaultSelected: true },
        { id: "vainilla", label: "Vainilla", extra: 0 },
        { id: "sin-cubierta", label: "Sin cubierta", extra: 0 },
      ],
    },
  },
  hamburguesa: {
    art: "burger",
    ingredients: burgerIngredients,
    sauces,
  },
  tacos: {
    art: "taco",
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "pastor", label: "Pastor", extra: 0, defaultSelected: true },
        { id: "cilantro", label: "Cilantro", extra: 0, defaultSelected: true },
        { id: "cebolla", label: "Cebolla", extra: 0, defaultSelected: true },
        { id: "limon", label: "Limón", extra: 0, defaultSelected: true },
        { id: "extra", label: "Taco extra", extra: 3 },
      ],
    },
    sauces,
  },
  bowl: {
    art: "bowl",
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "pollo", label: "Pollo", extra: 0, defaultSelected: true },
        { id: "arroz", label: "Arroz", extra: 0, defaultSelected: true },
        { id: "verde", label: "Verdura", extra: 0, defaultSelected: true },
        { id: "aguacate", label: "Aguacate", extra: 2 },
      ],
    },
  },
  quesadilla: {
    art: "quesadilla",
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "queso", label: "Queso", extra: 0, defaultSelected: true },
        { id: "tortilla", label: "Maíz", extra: 0, defaultSelected: true },
        { id: "harina", label: "Harina", extra: 0 },
        { id: "extra-queso", label: "Extra queso", extra: 2 },
      ],
    },
  },
  cafe: {
    art: "coffee",
    size: {
      id: "tamano",
      mode: "single",
      options: [
        { id: "chico", label: "Chico", extra: 0, defaultSelected: true },
        { id: "grande", label: "Grande", extra: 1.5 },
      ],
    },
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "azucar", label: "Azúcar", extra: 0, defaultSelected: true },
        { id: "leche", label: "Leche", extra: 0 },
      ],
    },
  },
  limonada: {
    art: "drink",
    size: drinkSize,
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "hielo", label: "Hielo", extra: 0, defaultSelected: true },
        { id: "menta", label: "Menta", extra: 0 },
        { id: "sin-azucar", label: "Sin azúcar", extra: 0 },
      ],
    },
  },
  agua: {
    art: "bottle",
    ingredients: {
      id: "ingredientes",
      mode: "single",
      options: [
        { id: "natural", label: "Natural", extra: 0, defaultSelected: true },
        { id: "gas", label: "Con gas", extra: 0 },
      ],
    },
  },
  cerveza: {
    art: "bottle",
    ingredients: {
      id: "ingredientes",
      mode: "single",
      options: [
        { id: "clara", label: "Clara", extra: 0, defaultSelected: true },
        { id: "oscura", label: "Oscura", extra: 0 },
      ],
    },
  },
  pastel: {
    art: "cake",
    ingredients: {
      id: "ingredientes",
      mode: "single",
      options: [
        { id: "chocolate", label: "Chocolate", extra: 0, defaultSelected: true },
        { id: "vainilla", label: "Vainilla", extra: 0 },
      ],
    },
  },
  helado: {
    art: "cake",
    ingredients: {
      id: "ingredientes",
      mode: "multi",
      options: [
        { id: "vainilla", label: "Vainilla", extra: 0, defaultSelected: true },
        { id: "chocolate", label: "Chocolate", extra: 0 },
        { id: "fresa", label: "Fresa", extra: 0 },
      ],
    },
  },
};

export function setupFor(itemId: string): ProductSetup {
  return productSetups[itemId] ?? { art: "burger" };
}
