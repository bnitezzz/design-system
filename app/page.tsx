import { Suspense } from "react";
import { PosShell } from "@/components/pos/shell";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="pos-app">Cargando el sistema…</div>}>
      <PosShell />
    </Suspense>
  );
}
