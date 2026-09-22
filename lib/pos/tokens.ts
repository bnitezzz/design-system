/**
 * Medidas tomadas del CSS de Figma (archivo Untitled, nodo 0:1).
 * Los trazos punteados #8A38F5 son guías de medición, no cromo del producto.
 */
export const posTokens = {
  view: { width: 1280, height: 832 },
  kiosk: { width: 850, height: 1280 },
  contador: { width: 203.9, height: 610.1 },
  product: { width: 127, height: 256 },
  category: { width: 60, height: 104 },
  ticket: { width: 423, height: 461 },
  contentColumn: { width: 814, height: 692 },
  productArea: { width: 915, height: 534 },
  arrow: { width: 44, stroke: 5 },
  stackGap: 19,
  radiusCard: 15,
  radiusControl: 5,
  canvas: "#FFFFFF",
  ink: "#000000",
  guide: "#8A38F5",
  cardShadow:
    "0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
  fontFamily: "Inter",
  headingWeight: 600,
  headingLineHeight: 34,
} as const;

export const posStatusColors = {
  nuevo: { bg: "#EEF2FF", fg: "#312E81" },
  preparando: { bg: "#FEF3C7", fg: "#92400E" },
  listo: { bg: "#D1FAE5", fg: "#065F46" },
  "en-camino": { bg: "#E0F2FE", fg: "#075985" },
  entregado: { bg: "#F4F4F5", fg: "#3F3F46" },
  alerta: { bg: "#FEE2E2", fg: "#991B1B" },
  pagado: { bg: "#D1FAE5", fg: "#065F46" },
  pendiente: { bg: "#FFEDD5", fg: "#9A3412" },
} as const;
