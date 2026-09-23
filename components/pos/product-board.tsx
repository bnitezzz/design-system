"use client";

import { categories, setupFor } from "@/lib/pos/catalog";
import { formatMoney } from "@/lib/pos/format";
import type { CategoryId, MenuItem } from "@/lib/pos/types";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

export function ProductBoard({
  items,
  selectedId,
  category,
  onCategory,
  onSelect,
  onConfigure,
  quantityOf,
  stacked = false,
}: {
  items: MenuItem[];
  selectedId: string | null;
  category: CategoryId | "todas";
  onCategory: (next: CategoryId | "todas") => void;
  onSelect: (id: string) => void;
  onConfigure: (item: MenuItem) => void;
  quantityOf?: (id: string) => number;
  stacked?: boolean;
}) {
  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const categoryLabel =
    category === "todas"
      ? "En carta"
      : categories.find((item) => item.id === category)?.label ?? "En carta";

  return (
    <div className={cn("pos-group45", stacked && "is-stacked")}>
      <header className="pos-group45-head">
        <div>
          <h2 className="pos-group45-title">{selected ? selected.name : "Sin productos"}</h2>
          <nav className="pos-index" aria-label="Categorías">
            <button
              type="button"
              className={category === "todas" ? "is-active" : undefined}
              onClick={() => onCategory("todas")}
            >
              Todas
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={category === item.id ? "is-active" : undefined}
                onClick={() => onCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <span className="pos-live-pill">{categoryLabel}</span>
      </header>

      <div className="pos-group45-body">
        <div className="pos-group45-stage">
          {selected ? (
            <button type="button" className="pos-group45-art" onClick={() => onConfigure(selected)}>
              <ProductArt id={setupFor(selected.id).art} className="is-stage" />
              <span className="pos-sr">Armar {selected.name}</span>
            </button>
          ) : (
            <p className="pos-empty">Ningún producto coincide con la búsqueda.</p>
          )}
        </div>

        <aside className="pos-group45-side">
          <div className="pos-ledger-wrap">
            <table className="pos-ledger">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Precio</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={2} className="pos-ledger-empty">
                      Nada en esta vista.
                    </td>
                  </tr>
                )}
                {items.map((item) => {
                  const qty = quantityOf?.(item.id) ?? 0;
                  const active = selected?.id === item.id;
                  return (
                    <tr key={item.id} className={active ? "is-selected" : undefined}>
                      <th scope="row">
                        <button type="button" onClick={() => onSelect(item.id)}>
                          {item.name}
                          {qty > 0 ? <small> · {qty}</small> : null}
                        </button>
                      </th>
                      <td>{formatMoney(item.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pos-slot">
            {selected ? (
              <>
                <p>{selected.detail}</p>
                <strong>{formatMoney(selected.price)}</strong>
                <button type="button" className="pos-arm" onClick={() => onConfigure(selected)}>
                  Armar
                </button>
              </>
            ) : (
              <p>Elige un producto de la lista.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
