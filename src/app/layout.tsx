import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://react-comic-viewer.kkweb.io"),
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
      <body style={{ margin: 0, fontFamily: "arial, sans-serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
