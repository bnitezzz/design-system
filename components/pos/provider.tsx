"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { menuById } from "@/lib/pos/catalog";
import { clampQty } from "@/lib/pos/format";
import type {
  CartLine,
  CartSource,
  PayMethod,
  ServiceChannel,
  ServiceOrder,
} from "@/lib/pos/types";

type Carts = Record<CartSource, CartLine[]>;

type ChargeResult =
  | { ok: true; change: number; orderNumber: number }
  | { ok: false; error: string };

type PosContextValue = {
  now: number | null;
  orders: ServiceOrder[];
  carts: Carts;
  addItem: (source: CartSource, itemId: string) => void;
  setQty: (source: CartSource, lineId: string, qty: number) => void;
  setNote: (source: CartSource, lineId: string, note: string) => void;
  clearCart: (source: CartSource) => void;
  sendCaja: (channel: ServiceChannel, table: string) => ChargeResult;
  payCart: (
    source: CartSource,
    method: PayMethod,
    channel: ServiceChannel,
    table: string,
    tendered?: number
  ) => ChargeResult;
  payOrder: (orderId: string, method: PayMethod, tendered?: number) => ChargeResult;
  advanceKitchen: (orderId: string) => void;
  takeForDelivery: (orderId: string) => void;
  markDelivered: (orderId: string) => void;
  lineCount: (source: CartSource) => number;
  cartTotal: (source: CartSource) => number;
  addDetailed: (source: CartSource, itemId: string, qty: number, note: string) => void;
};

const PosContext = createContext<PosContextValue | null>(null);

function lineFromItem(itemId: string, qty: number, note: string) {
  const item = menuById.get(itemId);
  if (!item) return null;
  return {
    id: `${itemId}-${Math.random().toString(36).slice(2, 8)}`,
    itemId,
    name: item.name,
    qty,
    price: item.price,
    note: note.trim().slice(0, 80),
    station: item.station,
  };
}

function buildSeed(now: number): ServiceOrder[] {
  const line = (
    itemId: string,
    qty: number,
    note = ""
  ): ServiceOrder["lines"][number] => {
    const built = lineFromItem(itemId, qty, note);
    if (!built) {
      throw new Error("El menú de demostración está incompleto.");
    }
    return built;
  };

  return [
    {
      id: "ord-1042",
      number: 1042,
      source: "caja",
      channel: "mesa",
      table: "Mesa 7",
      lines: [line("tacos", 2), line("limonada", 2)],
      status: "nuevo",
      paid: false,
      createdAt: now - 3 * 60 * 1000,
    },
    {
      id: "ord-1041",
      number: 1041,
      source: "caja",
      channel: "mesa",
      table: "Mesa 4",
      lines: [line("hamburguesa", 1, "Término medio"), line("cafe", 1)],
      status: "preparando",
      paid: false,
      createdAt: now - 9 * 60 * 1000,
    },
    {
      id: "ord-1040",
      number: 1040,
      source: "autopago",
      channel: "llevar",
      table: "Mostrador",
      lines: [line("combo-almuerzo", 1), line("cafe", 1)],
      status: "preparando",
      paid: true,
      payMethod: "tarjeta",
      createdAt: now - 6 * 60 * 1000,
    },
    {
      id: "ord-1038",
      number: 1038,
      source: "caja",
      channel: "mesa",
      table: "Mesa 12",
      lines: [line("bowl", 1), line("agua", 1)],
      status: "listo",
      paid: true,
      payMethod: "tarjeta",
      createdAt: now - 14 * 60 * 1000,
    },
    {
      id: "ord-1036",
      number: 1036,
      source: "caja",
      channel: "delivery",
      table: "Entrega",
      lines: [line("combo-familiar", 1, "Sin cebolla"), line("cerveza", 2)],
      status: "listo",
      paid: true,
      payMethod: "transferencia",
      createdAt: now - 18 * 60 * 1000,
    },
  ];
}

function orderTotal(order: ServiceOrder): number {
  return order.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}

export function PosProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<number | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [carts, setCarts] = useState<Carts>({ caja: [], autopago: [] });
  const [nextNumber, setNextNumber] = useState(1043);

  useEffect(() => {
    const stamp = Date.now();
    setNow(stamp);
    setOrders((current) => (current.length > 0 ? current : buildSeed(stamp)));
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<PosContextValue>(() => {
    const cartTotal = (source: CartSource) =>
      carts[source].reduce((sum, line) => {
        const item = menuById.get(line.itemId);
        return sum + (item ? item.price * line.qty : 0);
      }, 0);

    const snapshot = (source: CartSource) =>
      carts[source]
        .map((line) => lineFromItem(line.itemId, line.qty, line.note))
        .filter((line): line is NonNullable<typeof line> => line !== null);

    const createOrder = (
      source: CartSource,
      channel: ServiceChannel,
      table: string,
      paid: boolean,
      payMethod?: PayMethod
    ): ServiceOrder | null => {
      const lines = snapshot(source);
      if (lines.length === 0) return null;
      const order: ServiceOrder = {
        id: `ord-${nextNumber}`,
        number: nextNumber,
        source,
        channel,
        table,
        lines,
        status: "nuevo",
        paid,
        payMethod,
        createdAt: Date.now(),
      };
      setNextNumber((current) => current + 1);
      setOrders((current) => [order, ...current]);
      setCarts((current) => ({ ...current, [source]: [] }));
      return order;
    };

    return {
      now,
      orders,
      carts,
      lineCount: (source) =>
        carts[source].reduce((sum, line) => sum + line.qty, 0),
      cartTotal,
      addDetailed: (source, itemId, qty, note) => {
        if (!menuById.has(itemId)) return;
        const amount = Math.min(9, Math.max(1, Math.round(qty)));
        const cleanNote = note.trim().slice(0, 80);
        setCarts((current) => {
          const existing = current[source].find((line) => line.itemId === itemId);
          if (!existing) {
            return {
              ...current,
              [source]: [
                ...current[source],
                {
                  lineId: `${source}-${itemId}-${Date.now()}`,
                  itemId,
                  qty: amount,
                  note: cleanNote,
                },
              ],
            };
          }
          return {
            ...current,
            [source]: current[source].map((line) =>
              line.lineId === existing.lineId
                ? {
                    ...line,
                    qty: clampQty(line.qty + amount),
                    note: cleanNote || line.note,
                  }
                : line
            ),
          };
        });
      },
      addItem: (source, itemId) => {
        if (!menuById.has(itemId)) return;
        setCarts((current) => {
          const existing = current[source].find((line) => line.itemId === itemId);
          if (!existing) {
            return {
              ...current,
              [source]: [
                ...current[source],
                {
                  lineId: `${source}-${itemId}-${Date.now()}`,
                  itemId,
                  qty: 1,
                  note: "",
                },
              ],
            };
          }
          return {
            ...current,
            [source]: current[source].map((line) =>
              line.lineId === existing.lineId
                ? { ...line, qty: clampQty(line.qty + 1) }
                : line
            ),
          };
        });
      },
      setQty: (source, lineId, qty) => {
        const next = clampQty(qty);
        setCarts((current) => ({
          ...current,
          [source]:
            next <= 0
              ? current[source].filter((line) => line.lineId !== lineId)
              : current[source].map((line) =>
                  line.lineId === lineId ? { ...line, qty: next } : line
                ),
        }));
      },
      setNote: (source, lineId, note) => {
        setCarts((current) => ({
          ...current,
          [source]: current[source].map((line) =>
            line.lineId === lineId
              ? { ...line, note: note.slice(0, 80) }
              : line
          ),
        }));
      },
      clearCart: (source) => {
        setCarts((current) => ({ ...current, [source]: [] }));
      },
      sendCaja: (channel, table) => {
        try {
          const order = createOrder("caja", channel, table, false);
          if (!order) return { ok: false, error: "Agrega productos antes de enviar." };
          return { ok: true, change: 0, orderNumber: order.number };
        } catch {
          return { ok: false, error: "No se pudo enviar la comanda." };
        }
      },
      payCart: (source, method, channel, table, tendered) => {
        try {
          const total = cartTotal(source);
          if (total <= 0) return { ok: false, error: "La cuenta está vacía." };
          if (method === "efectivo" && source !== "autopago") {
            const cash = tendered ?? 0;
            if (cash < total) {
              return { ok: false, error: "El efectivo no cubre el total." };
            }
          }
          const paid = !(source === "autopago" && method === "efectivo");
          const order = createOrder(source, channel, table, paid, method);
          if (!order) return { ok: false, error: "No hay productos para cobrar." };
          const change =
            method === "efectivo" ? Math.max(0, (tendered ?? 0) - total) : 0;
          return { ok: true, change, orderNumber: order.number };
        } catch {
          return { ok: false, error: "No se pudo registrar el pago." };
        }
      },
      payOrder: (orderId, method, tendered) => {
        try {
          const order = orders.find((entry) => entry.id === orderId);
          if (!order) return { ok: false, error: "Esa cuenta ya no está abierta." };
          if (order.paid) return { ok: false, error: "La cuenta ya está pagada." };
          const total = orderTotal(order);
          if (method === "efectivo" && (tendered ?? 0) < total) {
            return { ok: false, error: "El efectivo no cubre el total." };
          }
          setOrders((current) =>
            current.map((entry) =>
              entry.id === orderId ? { ...entry, paid: true, payMethod: method } : entry
            )
          );
          const change =
            method === "efectivo" ? Math.max(0, (tendered ?? 0) - total) : 0;
          return { ok: true, change, orderNumber: order.number };
        } catch {
          return { ok: false, error: "No se pudo cobrar la cuenta." };
        }
      },
      advanceKitchen: (orderId) => {
        setOrders((current) =>
          current.map((order) => {
            if (order.id !== orderId) return order;
            if (order.status === "nuevo") return { ...order, status: "preparando" };
            if (order.status === "preparando") return { ...order, status: "listo" };
            return order;
          })
        );
      },
      takeForDelivery: (orderId) => {
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId && order.status === "listo"
              ? { ...order, status: "en-camino" }
              : order
          )
        );
      },
      markDelivered: (orderId) => {
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId && order.status === "en-camino"
              ? { ...order, status: "entregado" }
              : order
          )
        );
      },
    };
  }, [carts, nextNumber, now, orders]);

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
}

export function usePos(): PosContextValue {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error("usePos debe usarse dentro de PosProvider.");
  }
  return context;
}

export function orderAmount(order: ServiceOrder): number {
  return order.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}
