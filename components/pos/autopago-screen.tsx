"use client";

import { useMemo, useState } from "react";
import { categories, menu, quickNotes } from "@/lib/pos/catalog";
import { formatMoney } from "@/lib/pos/format";
import type { CategoryId, MenuItem, PayMethod } from "@/lib/pos/types";
import { usePos } from "./provider";
import { ArrowButton, CategoryTile, PosButton, ProductCard } from "./ui";

type Step = "inicio" | "menu" | "detalle" | "cuenta" | "pago" | "listo";

export function AutopagoScreen() {
  const pos = usePos();
  const [step, setStep] = useState<Step>("inicio");
  const [category, setCategory] = useState<CategoryId | "todas">("combos");
  const [active, setActive] = useState<MenuItem | null>(null);
  const [draftQty, setDraftQty] = useState(1);
  const [draftNote, setDraftNote] = useState("");
  const [method, setMethod] = useState<PayMethod>("tarjeta");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ number: number; paid: boolean } | null>(null);

  const visible = useMemo(
    () => menu.filter((item) => category === "todas" || item.category === category),
    [category]
  );

  function openItem(item: MenuItem) {
    setActive(item);
    setDraftQty(1);
    setDraftNote("");
    setStep("detalle");
  }

  function addDraft() {
    if (!active) return;
    pos.addDetailed("autopago", active.id, draftQty, draftNote);
    setStep("menu");
  }

  function confirmPay() {
    const result = pos.payCart("autopago", method, "llevar", "Kiosco");
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setReceipt({ number: result.orderNumber, paid: method !== "efectivo" });
    setStep("listo");
    setError("");
  }

  return (
    <section className="pos-kiosk" aria-label="Autopago">
      <header className="pos-kiosk-bar">
        <div className="pos-inline">
          {step !== "inicio" && step !== "listo" && (
            <ArrowButton
              label="Volver"
              onClick={() => {
                if (step === "detalle") setStep("menu");
                else if (step === "cuenta") setStep("menu");
                else if (step === "pago") setStep("cuenta");
                else setStep("inicio");
              }}
            />
          )}
          <div>
            <p className="pos-kicker">Propuesta · Autopago</p>
            <h2 className="pos-heading-sm">Combos y menú</h2>
          </div>
        </div>
        <p className="pos-kicker">Para llevar</p>
      </header>

      {step === "inicio" && (
        <div className="pos-kiosk-main">
          <div className="pos-kiosk-hero">
            <p className="pos-kicker">Toca para empezar</p>
            <h2>Pide aquí y paga en el momento.</h2>
            <p className="pos-muted" style={{ maxWidth: 420, fontSize: 18, lineHeight: "26px" }}>
              Elige un combo o arma tu pedido. La comanda llega a cocina en cuanto confirmas.
            </p>
          </div>
          <PosButton size="lg" block onClick={() => setStep("menu")}>
            Comenzar pedido
          </PosButton>
        </div>
      )}

      {step === "menu" && (
        <>
          <div className="pos-kiosk-main">
            <div className="pos-inline" style={{ alignItems: "stretch" }}>
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
            <div className="pos-product-grid">
              {visible.map((item) => (
                <ProductCard
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  detail={item.detail}
                  qty={pos.carts.autopago
                    .filter((line) => line.itemId === item.id)
                    .reduce((sum, line) => sum + line.qty, 0)}
                  onAdd={() => openItem(item)}
                />
              ))}
            </div>
          </div>
          <footer className="pos-kiosk-bottom">
            <div>
              <p className="pos-kicker">{pos.lineCount("autopago")} artículos</p>
              <strong className="pos-heading-sm">{formatMoney(pos.cartTotal("autopago"))}</strong>
            </div>
            <PosButton
              size="lg"
              disabled={pos.carts.autopago.length === 0}
              onClick={() => setStep("cuenta")}
            >
              Ver pedido
            </PosButton>
          </footer>
        </>
      )}

      {step === "detalle" && active && (
        <div className="pos-kiosk-main">
          <p className="pos-kicker">{active.category}</p>
          <h2 className="pos-heading">{active.name}</h2>
          <p className="pos-muted" style={{ fontSize: 18, lineHeight: "26px" }}>
            {active.detail}
          </p>
          <p className="pos-heading">{formatMoney(active.price * draftQty)}</p>
          <div className="pos-stepper">
            <button type="button" aria-label="Reducir cantidad" onClick={() => setDraftQty((qty) => Math.max(1, qty - 1))}>
              −
            </button>
            <span>{draftQty}</span>
            <button type="button" aria-label="Aumentar cantidad" onClick={() => setDraftQty((qty) => Math.min(9, qty + 1))}>
              +
            </button>
          </div>
          <div className="pos-filters">
            {quickNotes.map((note) => (
              <button
                key={note}
                type="button"
                className={draftNote === note ? "pos-chip is-active" : "pos-chip"}
                onClick={() => setDraftNote(note)}
              >
                {note}
              </button>
            ))}
          </div>
          <PosButton size="lg" onClick={addDraft}>
            Agregar al pedido
          </PosButton>
        </div>
      )}

      {step === "cuenta" && (
        <>
          <div className="pos-kiosk-main">
            <h2 className="pos-heading">Tu pedido</h2>
            {pos.carts.autopago.map((line) => {
              const item = menu.find((entry) => entry.id === line.itemId);
              if (!item) return null;
              return (
                <div key={line.lineId} className="pos-open-row">
                  <div>
                    <strong>{item.name}</strong>
                    <p className="pos-muted">
                      {line.qty} × {formatMoney(item.price)}
                      {line.note ? ` · ${line.note}` : ""}
                    </p>
                  </div>
                  <div className="pos-stepper">
                    <button
                      type="button"
                      aria-label={`Quitar uno de ${item.name}`}
                      onClick={() => pos.setQty("autopago", line.lineId, line.qty - 1)}
                    >
                      −
                    </button>
                    <span>{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`Agregar uno de ${item.name}`}
                      onClick={() => pos.setQty("autopago", line.lineId, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
            {pos.carts.autopago.length === 0 && (
              <p className="pos-empty">El pedido está vacío.</p>
            )}
          </div>
          <footer className="pos-kiosk-bottom">
            <strong className="pos-heading-sm">{formatMoney(pos.cartTotal("autopago"))}</strong>
            <PosButton
              size="lg"
              disabled={pos.carts.autopago.length === 0}
              onClick={() => setStep("pago")}
            >
              Pagar
            </PosButton>
          </footer>
        </>
      )}

      {step === "pago" && (
        <div className="pos-kiosk-main">
          <h2 className="pos-heading">¿Cómo pagas?</h2>
          <button
            type="button"
            className={method === "tarjeta" ? "pos-method is-active" : "pos-method"}
            onClick={() => setMethod("tarjeta")}
          >
            Tarjeta en este kiosco
          </button>
          <button
            type="button"
            className={method === "efectivo" ? "pos-method is-active" : "pos-method"}
            onClick={() => setMethod("efectivo")}
          >
            Efectivo en caja
          </button>
          <p className="pos-muted">
            {method === "tarjeta"
              ? "El pedido se marca pagado y pasa a cocina."
              : "Enviamos la comanda y la cuenta queda abierta en caja."}
          </p>
          {error && (
            <p className="pos-alert" role="alert">
              {error}
            </p>
          )}
          <PosButton size="lg" onClick={confirmPay}>
            Confirmar {formatMoney(pos.cartTotal("autopago"))}
          </PosButton>
        </div>
      )}

      {step === "listo" && receipt && (
        <div className="pos-kiosk-main">
          <div className="pos-kiosk-hero">
            <p className="pos-kicker">{receipt.paid ? "Pagado" : "Por cobrar en caja"}</p>
            <h2>Pedido #{receipt.number}</h2>
            <p className="pos-muted" style={{ fontSize: 18, lineHeight: "26px" }}>
              {receipt.paid
                ? "Cocina ya tiene la comanda. Espera a que te llamen por el número."
                : "Pasa a caja con este número. Cocina ya empezó el pedido."}
            </p>
          </div>
          <PosButton
            size="lg"
            onClick={() => {
              setReceipt(null);
              setStep("inicio");
            }}
          >
            Nuevo pedido
          </PosButton>
        </div>
      )}
    </section>
  );
}
