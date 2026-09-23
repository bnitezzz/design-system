"use client";

import Image from "next/image";
import { categories, setupFor } from "@/lib/pos/catalog";
import type { CategoryId, MenuItem } from "@/lib/pos/types";
import { cn } from "@/lib/utils";
import { ProductArt } from "./product-art";

const cardTitle: Record<string, string> = {
  "combo-almuerzo": "Combo #1",
  "combo-familiar": "Combo #2",
  "combo-barra": "Combo #3",
};

const cardPhoto: Record<string, string> = {
  "combo-almuerzo": "/menu/combo-burger.png",
  hamburguesa: "/menu/combo-burger.png",
};

function PlusMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
      <path fill="#ffffff" d="M10.15 3.6h3.7v6.55h6.55v3.7h-6.55v6.55h-3.7v-6.55H3.6v-3.7h6.55z" />
    </svg>
  );
}

export function ProductBoard({
  items,
  selectedId,
  category,
  onCategory,
  onSelect,
  onConfigure,
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
  return (
    <div className={cn("pos-group45", stacked && "is-stacked")}>
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

      <div className="pos-menu-list">
        {items.length === 0 && <p className="pos-empty">Ningún producto coincide con la búsqueda.</p>}
        {items.map((item) => {
          const title = cardTitle[item.id] ?? item.name;
          const photo = cardPhoto[item.id];
          const selected = item.id === selectedId;
          return (
            <article key={item.id} className="pos-menu-card" data-current={selected || undefined}>
              <h3 className="pos-menu-card-name">{title}</h3>
              <div className="pos-menu-card-visual">
                {photo ? (
                  <Image src={photo} alt="" width={355} height={227} />
                ) : (
                  <ProductArt id={setupFor(item.id).art} className="is-menu" />
                )}
              </div>
              <button
                type="button"
                className="pos-menu-plus"
                aria-label={`Agregar ${item.name}`}
                onClick={() => {
                  onSelect(item.id);
                  onConfigure(item);
                }}
              >
                <PlusMark />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
