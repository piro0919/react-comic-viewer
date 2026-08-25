import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo_Black } from "next/font/google";

/* 見出しの書体。9件が同じ字面だと、並んだときに見分けが付かない */
const display = Archivo_Black({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://react-comic-viewer.kkweb.io"),
  alternates: { canonical: "/" },
  title: "react-comic-viewer",
  description: "A comic/manga viewer component for React",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          margin: 0,
        }}
        className={display.variable}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
