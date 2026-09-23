"use client";

import { useEffect, useMemo, useState } from "react";
import { menu } from "@/lib/pos/catalog";
import { formatMoney, roundMoney } from "@/lib/pos/format";
import type { CategoryId, MenuItem, PayMethod } from "@/lib/pos/types";
import { ComboDialog } from "./combo-dialog";
import { ProductBoard } from "./product-board";
import { usePos } from "./provider";
import { ArrowButton, PosButton } from "./ui";

type Step = "inicio" | "menu" | "cuenta" | "pago" | "listo";

export function AutopagoScreen() {
  const pos = usePos();
  const [step, setStep] = useState<Step>("inicio");
  const [category, setCategory] = useState<CategoryId | "todas">("combos");
  const [selectedId, setSelectedId] = useState<string | null>("combo-almuerzo");
  const [configuring, setConfiguring] = useState<MenuItem | null>(null);
  const [method, setMethod] = useState<PayMethod>("tarjeta");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ number: number; paid: boolean } | null>(null);

  const visible = useMemo(
    () => menu.filter((item) => category === "todas" || item.category === category),
    [category]
  );

  useEffect(() => {
    if (visible.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!visible.some((item) => item.id === selectedId)) {
      setSelectedId(visible[0].id);
    }
  }, [visible, selectedId]);

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
                if (step === "cuenta") setStep("menu");
                else if (step === "pago") setStep("cuenta");
                else setStep("inicio");
              }}
            />
          )}
          {step !== "menu" && (
            <div>
              <p className="pos-kicker">Propuesta · Autopago</p>
              <h2 className="pos-heading-sm">Combos y menú</h2>
            </div>
          )}
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
            <ProductBoard
              stacked
              items={visible}
              selectedId={selectedId}
              category={category}
              onCategory={setCategory}
              onSelect={(id) => {
                setSelectedId(id);
                const item = visible.find((entry) => entry.id === id);
                if (item) setConfiguring(item);
              }}
              onConfigure={setConfiguring}
              quantityOf={(id) =>
                pos.carts.autopago
                  .filter((line) => line.itemId === id)
                  .reduce((sum, line) => sum + line.qty, 0)
              }
            />
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
                      {line.qty} × {formatMoney(roundMoney(item.price + line.extra))}
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

      {configuring && step === "menu" && (
        <ComboDialog
          item={configuring}
          onClose={() => setConfiguring(null)}
          onAdd={(note, extra) => {
            pos.addDetailed("autopago", configuring.id, 1, note, extra);
            setConfiguring(null);
          }}
        />
      )}
    </section>
  );
}
