"use client";

import { useMemo, useState } from "react";
import { categories, menu, quickNotes, tables } from "@/lib/pos/catalog";
import { formatClock, formatMoney } from "@/lib/pos/format";
import type { CategoryId, PayMethod, ServiceChannel } from "@/lib/pos/types";
import { orderAmount, usePos } from "./provider";
import { CategoryTile, Numpad, PosButton, ProductCard, StatusBadge } from "./ui";

const payLabels: Record<PayMethod, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

export function CajaScreen() {
  const pos = usePos();
  const [category, setCategory] = useState<CategoryId | "todas">("todas");
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<ServiceChannel>("mesa");
  const [table, setTable] = useState(tables[0]);
  const [pane, setPane] = useState<"ticket" | "abiertas">("ticket");
  const [method, setMethod] = useState<PayMethod>("efectivo");
  const [tendered, setTendered] = useState("");
  const [chargingId, setChargingId] = useState<string | "cart" | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const destination = channel === "mesa" ? table : channel === "llevar" ? "Mostrador" : "Entrega";
  const visible = useMemo(
    () =>
      menu.filter((item) => {
        const byCategory = category === "todas" || item.category === category;
        const byQuery = item.name.toLowerCase().includes(query.trim().toLowerCase());
        return byCategory && byQuery;
      }),
    [category, query]
  );
  const openOrders = pos.orders.filter((order) => !order.paid && order.status !== "entregado");
  const chargingOrder =
    chargingId && chargingId !== "cart"
      ? openOrders.find((order) => order.id === chargingId) ?? null
      : null;
  const chargingTotal =
    chargingId === "cart" ? pos.cartTotal("caja") : chargingOrder ? orderAmount(chargingOrder) : 0;
  const chargingLabel =
    chargingId === "cart" ? "ticket actual" : chargingOrder ? `#${chargingOrder.number}` : "";

  function closePay() {
    setChargingId(null);
    setError("");
    setTendered("");
    setMethod("efectivo");
  }

  function confirmPay() {
    const cash = Number(tendered || "0");
    const result =
      chargingId === "cart"
        ? pos.payCart("caja", method, channel, destination, cash)
        : chargingId
          ? pos.payOrder(chargingId, method, cash)
          : { ok: false as const, error: "No hay una cuenta seleccionada." };

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setToast(
      result.change > 0
        ? `Pedido #${result.orderNumber} cobrado. Cambio ${formatMoney(result.change)}.`
        : `Pedido #${result.orderNumber} cobrado.`
    );
    closePay();
  }

  function send() {
    const result = pos.sendCaja(channel, destination);
    if (!result.ok) {
      setToast(result.error);
      return;
    }
    setToast(`Pedido #${result.orderNumber} enviado a cocina.`);
  }

  return (
    <section className="pos-view" aria-label="Caja">
      <header className="pos-view-bar">
        <div className="pos-view-title">
          <p className="pos-kicker">Propuesta · Caja</p>
          <h2 className="pos-heading">Registrar pedido</h2>
        </div>
        <div className="pos-view-tools">
          <div className="pos-segments" aria-label="Canal de servicio">
            {(
              [
                ["mesa", "Mesa"],
                ["llevar", "Llevar"],
                ["delivery", "Delivery"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={channel === id ? "pos-segment is-active" : "pos-segment"}
                onClick={() => setChannel(id)}
                aria-pressed={channel === id}
              >
                {label}
              </button>
            ))}
          </div>
          {channel === "mesa" && (
            <select
              className="pos-select"
              aria-label="Mesa"
              value={table}
              onChange={(event) => setTable(event.target.value)}
            >
              {tables.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          )}
          <input
            className="pos-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar"
            aria-label="Buscar producto"
          />
          <span className="pos-kicker">{formatClock(pos.now)}</span>
        </div>
      </header>

      <div className="pos-view-body">
        <div className="pos-category-rail" aria-label="Categorías">
          <CategoryTile
            id="todas"
            label="Todas"
            active={category === "todas"}
            onClick={() => setCategory("todas")}
          />
          {categories.map((item) => (
            <CategoryTile
              key={item.id}
              id={item.id}
              label={item.label}
              active={category === item.id}
              onClick={() => setCategory(item.id)}
            />
          ))}
        </div>

        <div className="pos-catalog">
          <div className="pos-inline" style={{ justifyContent: "space-between" }}>
            <div className="pos-segments">
              <button
                type="button"
                className={pane === "ticket" ? "pos-segment is-active" : "pos-segment"}
                onClick={() => setPane("ticket")}
              >
                Menú
              </button>
              <button
                type="button"
                className={pane === "abiertas" ? "pos-segment is-active" : "pos-segment"}
                onClick={() => setPane("abiertas")}
              >
                Abiertas ({openOrders.length})
              </button>
            </div>
            {toast && <p className="pos-toast">{toast}</p>}
          </div>

          {pane === "ticket" ? (
            <div className="pos-product-grid">
              {visible.length === 0 && (
                <p className="pos-empty">Ningún producto coincide con la búsqueda.</p>
              )}
              {visible.map((item) => {
                const qty = pos.carts.caja
                  .filter((line) => line.itemId === item.id)
                  .reduce((sum, line) => sum + line.qty, 0);
                return (
                  <ProductCard
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    category={item.category}
                    qty={qty}
                    onAdd={() => pos.addItem("caja", item.id)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="pos-open-list">
              {openOrders.length === 0 && (
                <p className="pos-empty">No hay cuentas pendientes de cobro.</p>
              )}
              {openOrders.map((order) => (
                <article key={order.id} className="pos-open-row">
                  <div>
                    <strong>#{order.number}</strong>
                    <p className="pos-muted">
                      {order.table} · {formatMoney(orderAmount(order))}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                  <PosButton
                    onClick={() => {
                      setChargingId(order.id);
                      setError("");
                    }}
                  >
                    Cobrar
                  </PosButton>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="pos-contador" aria-label="Contador del pedido">
          <div className="pos-contador-head">
            <p className="pos-kicker">Contador</p>
            <h3 className="pos-heading-sm">{destination}</h3>
            <p className="pos-muted">{pos.lineCount("caja")} artículos</p>
          </div>
          <div className="pos-contador-lines">
            {pos.carts.caja.length === 0 && (
              <p className="pos-empty">Toca un producto para sumarlo.</p>
            )}
            {pos.carts.caja.map((line) => {
              const item = menu.find((entry) => entry.id === line.itemId);
              if (!item) return null;
              return (
                <div key={line.lineId} className="pos-line">
                  <div className="pos-line-top">
                    <span>{item.name}</span>
                    <span>{formatMoney(item.price * line.qty)}</span>
                  </div>
                  <div className="pos-stepper">
                    <button
                      type="button"
                      aria-label={`Quitar uno de ${item.name}`}
                      onClick={() => pos.setQty("caja", line.lineId, line.qty - 1)}
                    >
                      −
                    </button>
                    <span>{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`Agregar uno de ${item.name}`}
                      onClick={() => pos.setQty("caja", line.lineId, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <input
                    className="pos-note"
                    value={line.note}
                    maxLength={80}
                    placeholder="Nota"
                    aria-label={`Nota para ${item.name}`}
                    onChange={(event) => pos.setNote("caja", line.lineId, event.target.value)}
                  />
                  <div className="pos-filters">
                    {quickNotes.map((note) => (
                      <button
                        key={note}
                        type="button"
                        className="pos-chip"
                        onClick={() => pos.setNote("caja", line.lineId, note)}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pos-contador-foot">
            <div className="pos-total-row">
              <span>Total</span>
              <strong>{formatMoney(pos.cartTotal("caja"))}</strong>
            </div>
            <PosButton block onClick={send} disabled={pos.carts.caja.length === 0}>
              Enviar a cocina
            </PosButton>
            <PosButton
              block
              variant="secondary"
              disabled={pos.carts.caja.length === 0}
              onClick={() => {
                setChargingId("cart");
                setError("");
              }}
            >
              Cobrar
            </PosButton>
          </div>
        </aside>
      </div>

      {chargingId && (chargingId === "cart" || chargingOrder) && (
        <div className="pos-sheet" role="dialog" aria-modal="true" aria-labelledby="caja-pay-title">
          <div className="pos-sheet-card">
            <div className="pos-inline" style={{ justifyContent: "space-between" }}>
              <h3 id="caja-pay-title" className="pos-heading-sm">
                Cobrar {chargingLabel}
              </h3>
              <PosButton variant="ghost" onClick={closePay}>
                Cerrar
              </PosButton>
            </div>
            <div className="pos-pay-grid">
              <div className="pos-methods">
                <p className="pos-total-row">
                  <span>Total</span>
                  <strong>{formatMoney(chargingTotal)}</strong>
                </p>
                {(Object.keys(payLabels) as PayMethod[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={method === id ? "pos-method is-active" : "pos-method"}
                    onClick={() => setMethod(id)}
                    aria-pressed={method === id}
                  >
                    {payLabels[id]}
                  </button>
                ))}
                {method === "efectivo" && (
                  <PosButton
                    variant="secondary"
                    onClick={() => setTendered(String(chargingTotal))}
                  >
                    Monto exacto
                  </PosButton>
                )}
                {error && (
                  <p className="pos-alert" role="alert">
                    {error}
                  </p>
                )}
                <PosButton size="lg" onClick={confirmPay}>
                  Confirmar pago
                </PosButton>
              </div>
              {method === "efectivo" ? (
                <div>
                  <p className="pos-kicker">Recibido</p>
                  <p className="pos-heading">{formatMoney(Number(tendered || "0"))}</p>
                  <Numpad value={tendered} onChange={setTendered} />
                </div>
              ) : (
                <p className="pos-muted">
                  El pago queda registrado y la comanda sigue su curso en cocina.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
