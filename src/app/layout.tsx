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

const SITE_URL = "https://vespermag.co";
const TITLE = "Vesper — Life After Six";
const DESCRIPTION =
  "Vesper is a private, invite-only community of changemakers, with resources for goal setting, accountability, and connection, plus a monthly in-person gathering.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Vesper",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Vesper",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vesper" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
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
