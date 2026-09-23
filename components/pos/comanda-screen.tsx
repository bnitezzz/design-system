"use client";

import { useEffect, useMemo, useState } from "react";
import { stations } from "@/lib/pos/catalog";
import { courseLabel, formatMinutes, formatOrderNo } from "@/lib/pos/format";
import type { StationId } from "@/lib/pos/types";
import { usePos } from "./provider";
import { cn } from "@/lib/utils";

export function ComandaScreen() {
  const pos = usePos();
  const [station, setStation] = useState<StationId | "todas">("todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queue = useMemo(
    () =>
      pos.orders
        .filter((order) => {
          if (order.status === "en-camino" || order.status === "entregado") return false;
          if (station === "todas") return true;
          return order.lines.some((line) => line.station === station);
        })
        .sort((a, b) => a.number - b.number),
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
    <section className="pos-view pos-order-screen" aria-label="Comanda de cocina">
      <div className="pos-group45">
        <header className="pos-group45-head">
          <h2 className="pos-group45-title">
            {selected ? `Pedido #${formatOrderNo(selected.number)}` : "Sin pedidos"}
          </h2>
          {selected && (
            <span className={cn("pos-live-pill", selected.status === "listo" && "is-done")}>
              {courseLabel(selected.status)}
            </span>
          )}
        </header>

        <div className="pos-group45-body">
          <div className="pos-order-lines">
            {selected ? (
              <ul>
                {selected.lines.map((line) => (
                  <li key={line.id}>
                    <strong>
                      {line.qty}
                      <span>{line.name}</span>
                    </strong>
                    {(line.note || line.station) && (
                      <small>
                        {line.note || stations.find((item) => item.id === line.station)?.label}
                      </small>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pos-empty">No hay comandas en esta estación.</p>
            )}
            {selected && (
              <p className="pos-order-meta">
                {selected.table}
                {selected.paid ? "" : " · Por cobrar"}
              </p>
            )}
          </div>

          <aside className="pos-group45-side">
            <nav className="pos-index" aria-label="Estación">
              <button
                type="button"
                className={station === "todas" ? "is-active" : undefined}
                onClick={() => setStation("todas")}
              >
                Todas
              </button>
              {stations.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={station === item.id ? "is-active" : undefined}
                  onClick={() => setStation(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pos-ledger-wrap">
              <table className="pos-ledger">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.length === 0 && (
                    <tr>
                      <td colSpan={2} className="pos-ledger-empty">
                        Cola vacía.
                      </td>
                    </tr>
                  )}
                  {queue.map((order) => (
                    <tr key={order.id} className={order.id === selectedId ? "is-selected" : undefined}>
                      <th scope="row">
                        <button type="button" onClick={() => setSelectedId(order.id)}>
                          Pedido N° {formatOrderNo(order.number)}
                        </button>
                      </th>
                      <td>{formatMinutes(order.createdAt, pos.now)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pos-slot">
              {selected && action ? (
                <button
                  type="button"
                  className="pos-arm"
                  onClick={() => pos.advanceKitchen(selected.id)}
                >
                  {action}
                </button>
              ) : (
                <p>{selected ? "Este pedido ya está listo para el pase." : "Selecciona un pedido."}</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
