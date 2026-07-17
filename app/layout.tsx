import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kolleg AI — Guía del Studienkolleg",
  description:
    "Preguntas claras sobre el Studienkolleg en Alemania, respondidas con información oficial verificada.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
