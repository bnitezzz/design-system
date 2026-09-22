import type { ReactElement } from "react";
import type { ProductArtId } from "@/lib/pos/types";
import { cn } from "@/lib/utils";

function Burger() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true">
      <ellipse cx="80" cy="108" rx="46" ry="6" fill="#efe8df" />
      <path d="M38 62c0-22 18-38 42-38s42 16 42 38v4H38v-4z" fill="#f3d7a4" />
      <circle cx="58" cy="40" r="3" fill="#f7efe2" />
      <circle cx="74" cy="34" r="2.4" fill="#f7efe2" />
      <circle cx="92" cy="39" r="3" fill="#f7efe2" />
      <circle cx="108" cy="46" r="2.2" fill="#f7efe2" />
      <path d="M36 70h88c-2 8-10 12-18 12H54c-8 0-16-4-18-12z" fill="#6f8f45" />
      <rect x="40" y="78" width="80" height="8" rx="3" fill="#e10600" />
      <rect x="36" y="86" width="88" height="12" rx="4" fill="#c9843a" />
      <path d="M34 98h92c-2 8-14 12-46 12s-44-4-46-12z" fill="#e7b56a" />
    </svg>
  );
}

function Fries() {
  return (
    <svg viewBox="0 0 80 110" aria-hidden="true">
      <path d="M22 46h8l2 40H20l2-40z" fill="#f2c14e" />
      <path d="M34 38h8l1 48h-10l1-48z" fill="#f6d56a" />
      <path d="M46 44h8l-1 42H44l2-42z" fill="#e2b13a" />
      <path d="M16 58h48l-6 40H22L16 58z" fill="#e10600" />
      <path d="M18 58h44l-2 8H20l-2-8z" fill="#b10500" />
    </svg>
  );
}

function Drink() {
  return (
    <svg viewBox="0 0 70 120" aria-hidden="true">
      <rect x="18" y="18" width="34" height="86" rx="8" fill="#1d4ed8" />
      <rect x="22" y="28" width="26" height="34" rx="4" fill="#ffffff" />
      <circle cx="35" cy="45" r="8" fill="#1d4ed8" />
      <rect x="16" y="14" width="38" height="8" rx="3" fill="#dbe4ff" />
    </svg>
  );
}

function Taco() {
  return (
    <svg viewBox="0 0 150 110" aria-hidden="true">
      <path d="M18 70c18-36 96-36 114 0-10 22-28 28-57 28S28 92 18 70z" fill="#f0c36a" />
      <path d="M34 68c12-18 70-18 82 0-8 10-22 14-41 14S42 78 34 68z" fill="#6f8f45" />
      <path d="M48 66c8-8 46-8 54 0-6 6-16 8-27 8s-21-2-27-8z" fill="#c45a2a" />
    </svg>
  );
}

function Bowl() {
  return (
    <svg viewBox="0 0 150 110" aria-hidden="true">
      <path d="M24 58h102c-6 28-28 40-51 40S30 86 24 58z" fill="#f4f4f5" stroke="#111" strokeWidth="3" />
      <path d="M36 58c6-16 22-24 39-24s33 8 39 24" fill="#6f8f45" />
      <circle cx="62" cy="50" r="8" fill="#c45a2a" />
      <circle cx="86" cy="46" r="7" fill="#e7b56a" />
    </svg>
  );
}

function Coffee() {
  return (
    <svg viewBox="0 0 140 110" aria-hidden="true">
      <path d="M34 40h70v34c0 16-14 26-35 26S34 90 34 74V40z" fill="#f7f7f8" stroke="#111" strokeWidth="3" />
      <path d="M104 48h12c8 0 14 6 14 14s-6 14-14 14h-12" fill="none" stroke="#111" strokeWidth="3" />
      <path d="M46 28c4 6 4 6 0 12M64 24c4 6 4 6 0 12M82 28c4 6 4 6 0 12" fill="none" stroke="#111" strokeWidth="2" />
      <rect x="42" y="58" width="54" height="8" fill="#6b3f24" />
    </svg>
  );
}

function Cake() {
  return (
    <svg viewBox="0 0 140 110" aria-hidden="true">
      <path d="M28 48h84v36c0 8-8 14-42 14S28 92 28 84V48z" fill="#f3d7a4" stroke="#111" strokeWidth="3" />
      <path d="M28 48c8 10 14 10 22 0s14-10 22 0 14 10 22 0 14-10 18 0" fill="#7c3a2d" />
      <rect x="66" y="28" width="4" height="18" fill="#111" />
    </svg>
  );
}

function Bottle() {
  return (
    <svg viewBox="0 0 80 120" aria-hidden="true">
      <rect x="32" y="10" width="16" height="18" rx="3" fill="#d4d4d8" stroke="#111" strokeWidth="2" />
      <path d="M26 32h28l8 16v48c0 8-8 12-22 12S18 104 18 96V48l8-16z" fill="#f4f4f5" stroke="#111" strokeWidth="3" />
      <rect x="24" y="58" width="32" height="16" fill="#111" />
    </svg>
  );
}

function Quesadilla() {
  return (
    <svg viewBox="0 0 150 110" aria-hidden="true">
      <path d="M20 58c28-30 82-30 110 0-28 28-82 28-110 0z" fill="#e7b56a" stroke="#111" strokeWidth="3" />
      <path d="M36 58c20-16 58-16 78 0" fill="none" stroke="#c9843a" strokeWidth="4" />
    </svg>
  );
}

const art: Record<ProductArtId, () => ReactElement> = {
  burger: Burger,
  fries: Fries,
  drink: Drink,
  taco: Taco,
  bowl: Bowl,
  coffee: Coffee,
  cake: Cake,
  bottle: Bottle,
  quesadilla: Quesadilla,
};

export function ProductArt({
  id,
  className,
}: {
  id: ProductArtId;
  className?: string;
}) {
  const Graphic = art[id];
  return (
    <span className={cn("pos-art", className)}>
      <Graphic />
    </span>
  );
}
