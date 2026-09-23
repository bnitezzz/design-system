import type { OrderStatus, ServiceChannel } from "./types";

export function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatMoney(amount: number): string {
  const value = roundMoney(amount);
  const hasFraction = Math.round(value * 100) % 100 !== 0;
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

export function formatExtra(amount: number, label?: string): string {
  if (label) return label;
  const value = roundMoney(amount);
  const [whole, fraction = "0"] = value.toFixed(1).split(".");
  if (fraction === "0") return `+${Number(whole)}$`;
  return `+${whole},${fraction}$`;
}

export function formatOrderNo(number: number): string {
  return String(Math.max(0, Math.round(number))).padStart(5, "0");
}

export function formatMinutes(from: number, now: number | null): string {
  if (now === null || from <= 0) return "—";
  const minutes = Math.max(0, Math.floor((now - from) / 60000));
  return `${String(minutes).padStart(2, "0")} min`;
}

export function courseLabel(status: OrderStatus): string {
  if (status === "listo") return "Listo";
  if (status === "en-camino") return "En camino";
  if (status === "entregado") return "Entregado";
  return "En curso";
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
