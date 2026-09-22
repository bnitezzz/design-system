import type { CategoryId, MenuItem, StationId } from "./types";

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
