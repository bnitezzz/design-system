"use client";

import { useState } from "react";
import { menu } from "@/lib/pos/catalog";
import { posTokens } from "@/lib/pos/tokens";
import type { ServiceOrder } from "@/lib/pos/types";
import { ComboDialog } from "./combo-dialog";
import { CategoryTile, Numpad, PosButton, ProductCard, SpecCard, StatusBadge, TicketCard } from "./ui";

const sampleOrder: ServiceOrder = {
  id: "sample",
  number: 1048,
  source: "caja",
  channel: "mesa",
  table: "Mesa 4",
  status: "preparando",
  paid: false,
  createdAt: 0,
  lines: [
    {
      id: "a",
      itemId: "tacos",
      name: "Tacos de pastor",
      qty: 2,
      price: 98,
      note: "Sin cebolla",
      station: "cocina",
    },
    {
      id: "b",
      itemId: "limonada",
      name: "Limonada",
      qty: 1,
      price: 46,
      note: "",
      station: "barra",
    },
  ],
};

const swatches = [
  ["Lienzo", posTokens.canvas, "View · #FFFFFF"],
  ["Tinta", posTokens.ink, "Flecha y acciones"],
  ["Nuevo", "#EEF2FF", "Pedido recién enviado"],
  ["Preparando", "#FEF3C7", "En estación"],
  ["Listo", "#D1FAE5", "Pasa a runners"],
  ["En camino", "#E0F2FE", "Lo lleva un runner"],
  ["Demorado", "#FEE2E2", "Más de 12 minutos"],
  ["Por cobrar", "#FFEDD5", "Cuenta abierta"],
];

export function Foundations() {
  return (
    <div className="pos-doc">
      <p className="pos-kicker">Servicio</p>
      <h2 className="pos-heading">Fundamentos</h2>
      <p className="pos-muted" style={{ maxWidth: 720, marginTop: 8 }}>
        Sistema de operación para registrar pedidos en caja, mandar la comanda a cocina,
        cobrar en autopago y entregar con runners. La carta se lee en un lienzo blanco:
        título grande, pastilla roja y lista con filete. Armar un producto abre el popup
        del combo, sin sombra.
      </p>

      <h3 className="pos-heading-sm" style={{ marginTop: 28 }}>
        Medidas
      </h3>
      <div className="pos-spec-grid" style={{ marginTop: 12 }}>
        <SpecCard label="View" value="1280 × 832" note="Caja, comanda y runners." />
        <SpecCard label="Combos" value="850 × 1280" note="Kiosco de autopago." />
        <SpecCard label="Contador" value="203.9 × 610.1" note="Cuenta activa en caja." />
        <SpecCard label="Producto" value="Lista" note="Nombre y precio, filete negro." />
        <SpecCard label="Categoría" value="60 × 104" note="Group 14." />
        <SpecCard label="Popup" value="Combo" note="Pastilla roja, checks y Agregar." />
        <SpecCard label="Columna" value="814 × 692" note="Frame 52, gap 19." />
        <SpecCard label="Flecha" value="44 / 5 px" note="Regreso, trazo negro." />
      </div>

      <h3 className="pos-heading-sm" style={{ marginTop: 28 }}>
        Color
      </h3>
      <div className="pos-swatches" style={{ marginTop: 12 }}>
        {swatches.map(([name, color, note]) => (
          <article key={name} className="pos-swatch">
            <i style={{ background: color, borderBottom: "1px solid #ececef" }} />
            <div>
              <strong>{name}</strong>
              <span>{note}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="pos-muted" style={{ marginTop: 12 }}>
        El magenta #8A38F5 del CSS es la guía punteada de Figma. No se usa como color de marca.
      </p>
      <div className="pos-guide" style={{ width: 204, height: 88, marginTop: 12 }}>
        Guía 204 × 88
        <br />
        borde 1 px #8A38F5
      </div>

      <div className="pos-columns" style={{ marginTop: 28 }}>
        <div>
          <h3 className="pos-heading-sm">Tipo</h3>
          <p className="pos-heading" style={{ marginTop: 8 }}>
            Inter 600, título a 28 / 34.
          </p>
          <p className="pos-muted">
            Los rótulos del lienzo (“Propuestas para la app”, “Propuesta - CAJA”,
            “Propuesta - Autopago”) marcan familia, peso y color blanco sobre fondo oscuro.
            En la interfaz el mismo estilo baja a una escala legible en mostrador y kiosco.
          </p>
        </div>
        <div>
          <h3 className="pos-heading-sm">Reglas de uso</h3>
          <ul className="pos-list">
            <li>Caja suma rápido: un toque agrega, la cuenta vive en el contador.</li>
            <li>Cocina trabaja un ticket grande y una cola, no una pared de precios.</li>
            <li>Autopago confirma el producto antes de sumarlo.</li>
            <li>El runner ve mesa, ítems, si está pagado y el siguiente paso.</li>
            <li>El estado nunca depende solo del color: siempre lleva texto.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ComponentGallery() {
  const [cash, setCash] = useState("200");
  const [category, setCategory] = useState<"combos" | "comida">("combos");
  const [comboOpen, setComboOpen] = useState(false);
  const sampleCombo = menu.find((item) => item.id === "combo-almuerzo") ?? menu[0];

  return (
    <div className="pos-doc">
      <p className="pos-kicker">Biblioteca</p>
      <h2 className="pos-heading">Componentes</h2>
      <div className="pos-component-row" style={{ marginTop: 19 }}>
        <div className="pos-measure">
          <PosButton>Enviar a cocina</PosButton>
          <PosButton variant="secondary">Cobrar</PosButton>
          <PosButton variant="danger">Cancelar</PosButton>
          <PosButton size="lg">Confirmar pago</PosButton>
          <span>Botón · radio 5 · altura 40 / 56</span>
        </div>
        <div className="pos-measure">
          <div className="pos-inline" style={{ flexWrap: "wrap" }}>
            <StatusBadge status="nuevo" />
            <StatusBadge status="preparando" late />
            <StatusBadge status="listo" />
            <StatusBadge status="en-camino" />
            <StatusBadge status="pagado" />
            <StatusBadge status="pendiente" />
          </div>
          <span>Estado con etiqueta, no solo color</span>
        </div>
        <div className="pos-measure">
          <Numpad value={cash} onChange={setCash} />
          <span>Efectivo recibido: ${cash || "0"}</span>
        </div>
      </div>

      <div className="pos-component-row" style={{ marginTop: 28 }}>
        <div className="pos-measure">
          <CategoryTile
            id="combos"
            label="Combos"
            active={category === "combos"}
            onClick={() => setCategory("combos")}
          />
          <CategoryTile
            id="comida"
            label="Comida"
            active={category === "comida"}
            onClick={() => setCategory("comida")}
          />
          <span>Group 14 · 60 × 104</span>
        </div>
        <div className="pos-measure">
          <ProductCard
            name="Combo almuerzo"
            price={189}
            category="combos"
            detail="Hamburguesa, papas y bebida."
            qty={1}
            onAdd={() => setComboOpen(true)}
          />
          <span>Toca el producto para armar el combo</span>
        </div>
        <div className="pos-measure">
          <TicketCard order={sampleOrder} now={null} actionLabel="Marcar listo" onAction={() => undefined} />
          <span>Comanda en lectura, filete negro</span>
        </div>
      </div>
      {comboOpen && (
        <ComboDialog
          item={sampleCombo}
          onClose={() => setComboOpen(false)}
          onAdd={() => setComboOpen(false)}
        />
      )}
    </div>
  );
}
