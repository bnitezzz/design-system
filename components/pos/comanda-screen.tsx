"use client";

import { useEffect, useMemo, useState } from "react";
import { stations } from "@/lib/pos/catalog";
import { formatElapsed, isLate, statusLabel } from "@/lib/pos/format";
import type { StationId } from "@/lib/pos/types";
import { usePos } from "./provider";
import { TicketCard } from "./ui";
import { cn } from "@/lib/utils";

export function ComandaScreen() {
  const pos = usePos();
  const [station, setStation] = useState<StationId | "todas">("todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queue = useMemo(
    () =>
      pos.orders.filter((order) => {
        if (order.status === "en-camino" || order.status === "entregado") return false;
        if (station === "todas") return true;
        return order.lines.some((line) => line.station === station);
      }),
    [pos.orders, station]
  );

  useEffect(() => {
    if (queue.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!queue.some((order) => order.id === selectedId)) {
      setSelectedId(queue[0].id);
    }
  }, [queue, selectedId]);

  const selected = queue.find((order) => order.id === selectedId) ?? null;
  const action =
    selected?.status === "nuevo"
      ? "Empezar"
      : selected?.status === "preparando"
        ? "Marcar listo"
        : undefined;

  return (
    <section className="pos-view" aria-label="Comanda de cocina">
      <header className="pos-view-bar">
        <div className="pos-view-title">
          <p className="pos-kicker">Cocina</p>
          <h2 className="pos-heading">Comanda</h2>
        </div>
        <div className="pos-filters" aria-label="Estación">
          <button
            type="button"
            className={cn("pos-chip", station === "todas" && "is-active")}
            onClick={() => setStation("todas")}
          >
            Todas
          </button>
          {stations.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn("pos-chip", station === item.id && "is-active")}
              onClick={() => setStation(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>
      <div className="pos-view-body">
        <div className="pos-ticket-layout">
          <div className="pos-queue" aria-label="Cola de pedidos">
            {queue.length === 0 && (
              <p className="pos-empty">No hay comandas en esta estación.</p>
            )}
            {queue.map((order) => (
              <button
                key={order.id}
                type="button"
                className={cn("pos-queue-item", order.id === selectedId && "is-active")}
                onClick={() => setSelectedId(order.id)}
              >
                <span className="pos-inline" style={{ justifyContent: "space-between" }}>
                  <strong>#{order.number}</strong>
                  <span>{formatElapsed(order.createdAt, pos.now)}</span>
                </span>
                <span className="pos-muted">
                  {order.table} · {statusLabel[order.status]}
                  {isLate(order.createdAt, pos.now, order.status) ? " · Demorado" : ""}
                </span>
                <span className="pos-muted">
                  {order.lines.map((line) => `${line.qty} ${line.name}`).join(" · ")}
                </span>
              </button>
            ))}
          </div>
          <TicketCard
            order={selected}
            now={pos.now}
            actionLabel={action}
            onAction={
              selected && action
                ? () => pos.advanceKitchen(selected.id)
                : undefined
            }
          />
        </div>
      </div>
    </section>
  );
}
