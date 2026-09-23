"use client";

import { useEffect, useId, useState } from "react";
import { setupFor } from "@/lib/pos/catalog";
import { formatExtra, formatMoney, roundMoney } from "@/lib/pos/format";
import { describeDraft, initialDraft, toggleOption, type ModifierDraft } from "@/lib/pos/modifiers";
import type { MenuItem, ModifierGroup } from "@/lib/pos/types";
import { ProductArt } from "./product-art";

function OptionList({
  itemId,
  group,
  draft,
  onToggle,
  className,
}: {
  itemId: string;
  group: ModifierGroup;
  draft: ModifierDraft;
  onToggle: (groupId: string, optionId: string) => void;
  className?: string;
}) {
  const selected = draft[group.id] ?? [];
  return (
    <div className={className} role={group.mode === "single" ? "radiogroup" : "group"}>
      {group.options.map((option) => {
        const on = selected.includes(option.id);
        const showExtra = option.extra !== 0 || Boolean(option.extraLabel);
        return (
          <label key={option.id} className="pos-opt">
            <input
              type={group.mode === "single" ? "radio" : "checkbox"}
              name={`${itemId}-${group.id}`}
              checked={on}
              onChange={() => onToggle(group.id, option.id)}
            />
            <span>{option.label}</span>
            {showExtra && <em>{formatExtra(option.extra, option.extraLabel)}</em>}
          </label>
        );
      })}
    </div>
  );
}

export function ComboDialog({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  onClose: () => void;
  onAdd: (note: string, extra: number) => void;
}) {
  const titleId = useId();
  const setup = setupFor(item.id);
  const [draft, setDraft] = useState<ModifierDraft>(() => initialDraft(item.id));
  const selection = describeDraft(item.id, draft);
  const total = roundMoney(item.price + selection.extra);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggle(groupId: string, optionId: string) {
    setDraft((current) => toggleOption(item.id, current, groupId, optionId));
  }

  return (
    <div
      className="pos-sheet"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="pos-combo"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h3 id={titleId} className="pos-combo-tab">
          {item.name}
        </h3>
        <button type="button" className="pos-combo-close" onClick={onClose}>
          Cerrar
        </button>

        <div className="pos-combo-body">
          <div className={setup.ingredients ? "pos-combo-hero" : "pos-combo-hero is-solo"}>
            <ProductArt id={setup.art} className="is-hero" />
            {setup.ingredients && (
              <OptionList
                itemId={item.id}
                group={setup.ingredients}
                draft={draft}
                onToggle={toggle}
                className="pos-opt-grid"
              />
            )}
          </div>

          {setup.sides && setup.size && (
            <>
              <hr className="pos-combo-rule" />
              <div className="pos-combo-sides">
                <ProductArt id="fries" className="is-side" />
                <ProductArt id="drink" className="is-side" />
                <OptionList
                  itemId={item.id}
                  group={setup.size}
                  draft={draft}
                  onToggle={toggle}
                  className="pos-opt-stack"
                />
              </div>
            </>
          )}

          {!setup.sides && setup.size && (
            <>
              <hr className="pos-combo-rule" />
              <OptionList
                itemId={item.id}
                group={setup.size}
                draft={draft}
                onToggle={toggle}
                className="pos-opt-stack"
              />
            </>
          )}

          {setup.sauces && (
            <>
              <hr className="pos-combo-rule" />
              <OptionList
                itemId={item.id}
                group={setup.sauces}
                draft={draft}
                onToggle={toggle}
                className="pos-opt-row"
              />
            </>
          )}
        </div>

        <footer className="pos-combo-foot">
          <strong>{formatMoney(total)}</strong>
          <button
            type="button"
            className="pos-agregar"
            onClick={() => onAdd(selection.note, selection.extra)}
          >
            Agregar
          </button>
        </footer>
      </div>
    </div>
  );
}
