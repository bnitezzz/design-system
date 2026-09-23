"use client";

import type { ReactNode } from "react";
import { stationLabel } from "@/lib/pos/catalog";
import type { ProductArtId } from "@/lib/pos/types";
import { ProductArt } from "./product-art";
import {
  channelLabel,
  formatElapsed,
  formatMoney,
  isLate,
  statusLabel,
} from "@/lib/pos/format";
import type { CategoryId, OrderStatus, ServiceOrder } from "@/lib/pos/types";
import { cn } from "@/lib/utils";

const categoryArt: Record<CategoryId, ProductArtId> = {
  combos: "burger",
  comida: "taco",
  bebidas: "drink",
  postres: "cake",
};

const categoryMark: Record<CategoryId | "todas", string> = {
  todas: "Todo",
  combos: "Combo",
  comida: "Plato",
  bebidas: "Vaso",
  postres: "Dulce",
};

export function PosButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  size = "md",
  block,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "lg";
  block?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "pos-btn",
        variant === "secondary" && "pos-btn-secondary",
        variant === "ghost" && "pos-btn-ghost",
        variant === "danger" && "pos-btn-danger",
        size === "lg" && "pos-btn-lg",
        block && "pos-btn-block"
      )}
    >
      {children}
    </button>
  );
}

export function StatusBadge({
  status,
  late = false,
}: {
  status: OrderStatus | "pagado" | "pendiente";
  late?: boolean;
}) {
  const label =
    status === "pagado"
      ? "Pagado"
      : status === "pendiente"
        ? "Por cobrar"
        : statusLabel[status];

  return (
    <span className="pos-inline">
      <span className={`pos-badge pos-badge-${status}`}>{label}</span>
      {late && <span className="pos-badge pos-badge-alerta">Demorado</span>}
    </span>
  );
}

export function ArrowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="pos-arrow" onClick={onClick} aria-label={label}>
      <i />
    </button>
  );
}

export function CategoryTile({
  id,
  label,
  active,
  onClick,
}: {
  id: CategoryId | "todas";
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn("pos-category", active && "is-active")}
      onClick={onClick}
      aria-pressed={active}
    >
      <strong style={{ fontSize: 11, lineHeight: "14px" }}>{categoryMark[id]}</strong>
      <span>{label}</span>
    </button>
  );
}

export function ProductCard({
  name,
  price,
  category,
  detail,
  qty = 0,
  onAdd,
}: {
  name: string;
  price: number;
  category: CategoryId;
  detail?: string;
  qty?: number;
  onAdd: () => void;
}) {
  return (
    <button type="button" className="pos-product" onClick={onAdd}>
      <ProductArt id={categoryArt[category]} className="is-card" />
      {qty > 0 && <span className="pos-product-qty">{qty}</span>}
      <span className="pos-product-body">
        <span className="pos-product-name">{name}</span>
        {detail && <span className="pos-product-meta">{detail}</span>}
        <span className="pos-product-price">{formatMoney(price)}</span>
      </span>
    </button>
  );
}

export function Numpad({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "←"];

  return (
    <div className="pos-numpad" aria-label="Teclado de efectivo">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          className={cn("pos-key", key === "←" && "pos-key-ghost")}
          onClick={() => {
            if (key === "←") {
              onChange(value.slice(0, -1));
              return;
            }
            const next = `${value}${key}`.replace(/^0+(?=\d)/, "").slice(0, 6);
            onChange(next);
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );
}

export function TicketCard({
  order,
  now,
  actionLabel,
  onAction,
  actionDisabled,
}: {
  order: ServiceOrder | null;
  now: number | null;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}) {
  if (!order) {
    return (
      <article className="pos-ticket" aria-label="Comanda vacía">
        <div className="pos-empty">Selecciona un pedido de la cola.</div>
      </article>
    );
  }

  const late = isLate(order.createdAt, now, order.status);

  return (
    <article className="pos-ticket" aria-label={`Pedido ${order.number}`}>
      <div className={`pos-ticket-bar pos-ticket-bar-${order.status}`} />
      <div className="pos-ticket-body">
        <div className="pos-inline" style={{ justifyContent: "space-between" }}>
          <h3 className="pos-heading-sm">#{order.number}</h3>
          <strong>{formatElapsed(order.createdAt, now)}</strong>
        </div>
        <div className="pos-inline" style={{ flexWrap: "wrap" }}>
          <StatusBadge status={order.status} late={late} />
          <span className="pos-badge pos-badge-entregado">
            {channelLabel[order.channel]}
            {order.channel === "mesa" ? ` · ${order.table}` : ""}
          </span>
        </div>
        <ul className="pos-ticket-items">
          {order.lines.map((line) => (
            <li key={line.id}>
              <span>
                {line.qty} × {line.name}
                <small>
                  {stationLabel[line.station]}
                  {line.note ? ` · ${line.note}` : ""}
                </small>
              </span>
            </li>
          ))}
        </ul>
        {actionLabel && onAction && (
          <PosButton onClick={onAction} disabled={actionDisabled} block size="lg">
            {actionLabel}
          </PosButton>
        )}
      </div>
    </article>
  );
}

export function SpecCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="pos-spec-card">
      <span className="pos-kicker">{label}</span>
      <strong>{value}</strong>
      <span>{note}</span>
    </article>
  );
}
