import { setupFor } from "./catalog";
import { roundMoney } from "./format";
import type { ModifierGroup, ModifierOption } from "./types";

export type ModifierDraft = Record<string, string[]>;

function groupsOf(itemId: string): ModifierGroup[] {
  const setup = setupFor(itemId);
  return [setup.ingredients, setup.size, setup.sauces].filter(
    (group): group is ModifierGroup => Boolean(group)
  );
}

export function initialDraft(itemId: string): ModifierDraft {
  const draft: ModifierDraft = {};
  for (const group of groupsOf(itemId)) {
    const selected = group.options.filter((option) => option.defaultSelected).map((option) => option.id);
    if (group.mode === "single" && selected.length === 0 && group.options[0]) {
      draft[group.id] = [group.options[0].id];
    } else {
      draft[group.id] = selected;
    }
  }
  return draft;
}

export function toggleOption(
  itemId: string,
  draft: ModifierDraft,
  groupId: string,
  optionId: string
): ModifierDraft {
  const group = groupsOf(itemId).find((entry) => entry.id === groupId);
  if (!group) return draft;
  const current = draft[groupId] ?? [];
  if (group.mode === "single") {
    return { ...draft, [groupId]: [optionId] };
  }
  const next = current.includes(optionId)
    ? current.filter((id) => id !== optionId)
    : [...current, optionId];
  return { ...draft, [groupId]: next };
}

function optionNote(option: ModifierOption, group: ModifierGroup, selected: boolean): string | null {
  if (selected) {
    const changed = group.mode === "single" ? !option.defaultSelected : !option.defaultSelected;
    if (changed || group.id === "salsas") return option.label;
    return null;
  }
  if (option.defaultSelected && group.mode === "multi") {
    return `Sin ${option.label.toLowerCase()}`;
  }
  return null;
}

export function describeDraft(itemId: string, draft: ModifierDraft): { note: string; extra: number } {
  const parts: string[] = [];
  let extra = 0;

  for (const group of groupsOf(itemId)) {
    const selected = new Set(draft[group.id] ?? []);
    for (const option of group.options) {
      const on = selected.has(option.id);
      if (on) extra += option.extra;
      const label = optionNote(option, group, on);
      if (label) parts.push(label);
    }
  }

  return {
    note: parts.join(", ").slice(0, 80),
    extra: roundMoney(extra),
  };
}
