import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";

import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vesper — Life After Six",
  description:
    "Vesper is a private, invite-only community for people taking their faith, bodies, relationships, and work seriously.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${raleway.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-midnight text-ivory antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
