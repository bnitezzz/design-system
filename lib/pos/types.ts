export type CategoryId = "combos" | "comida" | "bebidas" | "postres";

export type StationId = "cocina" | "barra" | "postres";

export type ServiceChannel = "mesa" | "llevar" | "delivery";

export type OrderStatus =
  | "nuevo"
  | "preparando"
  | "listo"
  | "en-camino"
  | "entregado";

export type PayMethod = "efectivo" | "tarjeta" | "transferencia";

export type CartSource = "caja" | "autopago";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  station: StationId;
  detail: string;
};

export type CartLine = {
  lineId: string;
  itemId: string;
  qty: number;
  note: string;
  extra: number;
};

export type ProductArtId =
  | "burger"
  | "fries"
  | "drink"
  | "taco"
  | "bowl"
  | "coffee"
  | "cake"
  | "bottle"
  | "quesadilla";

export type ModifierOption = {
  id: string;
  label: string;
  extra: number;
  extraLabel?: string;
  defaultSelected?: boolean;
};

export type ModifierGroup = {
  id: string;
  mode: "multi" | "single";
  options: ModifierOption[];
};

export type ProductSetup = {
  art: ProductArtId;
  ingredients?: ModifierGroup;
  size?: ModifierGroup;
  sauces?: ModifierGroup;
  sides?: boolean;
};

export type OrderLine = {
  id: string;
  itemId: string;
  name: string;
  qty: number;
  price: number;
  note: string;
  station: StationId;
};

export type ServiceOrder = {
  id: string;
  number: number;
  source: CartSource;
  channel: ServiceChannel;
  table: string;
  lines: OrderLine[];
  status: OrderStatus;
  paid: boolean;
  payMethod?: PayMethod;
  createdAt: number;
};

export type PosView =
  | "fundamentos"
  | "componentes"
  | "caja"
  | "comanda"
  | "autopago"
  | "runners";
