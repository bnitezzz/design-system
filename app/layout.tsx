import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./pos.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-pos",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Servicio · Design system",
  description:
    "Sistema de caja, comanda, autopago y runners. Componentes, medidas y flujos de operación.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.variable} pos-root`}>{children}</body>
    </html>
  );
}
