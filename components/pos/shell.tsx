"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PosProvider } from "./provider";
import { Foundations, ComponentGallery } from "./reference";
import { CajaScreen } from "./caja-screen";
import { ComandaScreen } from "./comanda-screen";
import { AutopagoScreen } from "./autopago-screen";
import { RunnersScreen } from "./runners-screen";
import type { PosView } from "@/lib/pos/types";
import { cn } from "@/lib/utils";

const tabs: { id: PosView; label: string }[] = [
  { id: "fundamentos", label: "Fundamentos" },
  { id: "componentes", label: "Componentes" },
  { id: "caja", label: "Caja" },
  { id: "comanda", label: "Comanda" },
  { id: "autopago", label: "Autopago" },
  { id: "runners", label: "Runners" },
];

function isView(value: string | null): value is PosView {
  return tabs.some((tab) => tab.id === value);
}

export function PosShell() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("vista");
  const view: PosView = isView(current) ? current : "fundamentos";

  function select(next: PosView) {
    const query = new URLSearchParams(params.toString());
    query.set("vista", next);
    router.replace(`/?${query.toString()}`, { scroll: false });
  }

  return (
    <PosProvider>
      <div className="pos-app">
        <header className="pos-appbar">
          <div className="pos-brand">
            <Link href="/">Servicio</Link>
            <span>Caja, comanda, autopago y runners</span>
          </div>
          <nav aria-label="Secciones del sistema">
            <div className="pos-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={cn("pos-tab", view === tab.id && "is-active")}
                  aria-pressed={view === tab.id}
                  onClick={() => select(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </header>
        <main className="pos-stage">
          {view === "fundamentos" && <Foundations />}
          {view === "componentes" && <ComponentGallery />}
          {view === "caja" && (
            <>
              <p className="pos-stage-copy">
                <strong>Caja.</strong> Un toque suma al contador. Enviar manda la comanda;
                cobrar cierra la cuenta o deja el pago registrado.
              </p>
              <CajaScreen />
            </>
          )}
          {view === "comanda" && (
            <>
              <p className="pos-stage-copy">
                <strong>Comanda.</strong> La cola entra por caja o autopago. La estación
                empieza el pedido y lo marca listo para el pase.
              </p>
              <ComandaScreen />
            </>
          )}
          {view === "autopago" && (
            <>
              <p className="pos-stage-copy">
                <strong>Autopago.</strong> Kiosco 850 × 1280. Tarjeta queda pagada;
                efectivo abre la cuenta en caja. En ambos casos cocina recibe la comanda.
              </p>
              <AutopagoScreen />
            </>
          )}
          {view === "runners" && (
            <>
              <p className="pos-stage-copy">
                <strong>Runners.</strong> Solo pedidos listos. Tomar los pasa a en camino;
                entregar los cierra. El badge indica si todavía hay que cobrar.
              </p>
              <RunnersScreen />
            </>
          )}
        </main>
      </div>
    </PosProvider>
  );
}
