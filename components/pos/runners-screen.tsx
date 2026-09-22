"use client";

import { useState } from "react";
import { channelLabel, formatElapsed, formatMoney, isLate } from "@/lib/pos/format";
import type { ServiceChannel } from "@/lib/pos/types";
import { orderAmount, usePos } from "./provider";
import { PosButton, StatusBadge } from "./ui";
import { cn } from "@/lib/utils";

const filters: { id: ServiceChannel | "todas"; label: string }[] = [
  { id: "todas", label: "Todos" },
  { id: "mesa", label: "Sala" },
  { id: "llevar", label: "Para llevar" },
  { id: "delivery", label: "Delivery" },
];

export function RunnersScreen() {
  const pos = usePos();
  const [channel, setChannel] = useState<ServiceChannel | "todas">("todas");

  const active = pos.orders.filter((order) => {
    const visible = order.status === "listo" || order.status === "en-camino";
    const byChannel = channel === "todas" || order.channel === channel;
    return visible && byChannel;
  });
  const delivered = pos.orders.filter((order) => order.status === "entregado").length;

  return (
    <section className="pos-view" aria-label="Runners">
      <header className="pos-view-bar">
        <div className="pos-view-title">
          <p className="pos-kicker">Pase y entrega</p>
          <h2 className="pos-heading">Runners</h2>
        </div>
        <div className="pos-inline">
          <div className="pos-filters" aria-label="Canal">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={cn("pos-chip", channel === filter.id && "is-active")}
                onClick={() => setChannel(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <span className="pos-kicker">{delivered} entregados</span>
        </div>
      </header>
      <div className="pos-runner-grid">
        {active.length === 0 && (
          <p className="pos-empty">No hay pedidos listos para salir.</p>
        )}
        {active.map((order) => (
          <article key={order.id} className="pos-runner-card">
            <div className="pos-inline" style={{ justifyContent: "space-between" }}>
              <h3 className="pos-heading-sm">#{order.number}</h3>
              <span>{formatElapsed(order.createdAt, pos.now)}</span>
            </div>
            <p className="pos-muted">
              {channelLabel[order.channel]} · {order.table}
            </p>
            <div className="pos-inline" style={{ flexWrap: "wrap" }}>
              <StatusBadge
                status={order.status}
                late={isLate(order.createdAt, pos.now, order.status)}
              />
              <StatusBadge status={order.paid ? "pagado" : "pendiente"} />
            </div>
            <ul>
              {order.lines.map((line) => (
                <li key={line.id}>
                  {line.qty} × {line.name}
                  {line.note ? <small className="pos-muted"> · {line.note}</small> : null}
                </li>
              ))}
            </ul>
            <p className="pos-muted">{formatMoney(orderAmount(order))}</p>
            {order.status === "listo" ? (
              <PosButton onClick={() => pos.takeForDelivery(order.id)}>
                Tomar pedido
              </PosButton>
            ) : (
              <PosButton variant="secondary" onClick={() => pos.markDelivered(order.id)}>
                Marcar entregado
              </PosButton>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
