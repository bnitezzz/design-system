import type { OrderStatus, ServiceChannel } from "./types";

export function formatMoney(amount: number): string {
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${Math.round(amount)}`;
  }
}

export function formatClock(now: number | null): string {
  if (now === null) return "—";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
  } catch {
    return "—";
  }
}

export function formatElapsed(from: number, now: number | null): string {
  if (now === null || from <= 0) return "—";
  const seconds = Math.max(0, Math.floor((now - from) / 1000));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export function isLate(
  from: number,
  now: number | null,
  status: OrderStatus
): boolean {
  if (now === null || status === "listo" || status === "entregado") return false;
  return now - from > 12 * 60 * 1000;
}

export const statusLabel: Record<OrderStatus, string> = {
  nuevo: "Nuevo",
  preparando: "Preparando",
  listo: "Listo",
  "en-camino": "En camino",
  entregado: "Entregado",
};

export const channelLabel: Record<ServiceChannel, string> = {
  mesa: "Mesa",
  llevar: "Para llevar",
  delivery: "Delivery",
};

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(99, Math.max(0, Math.round(qty)));
}
