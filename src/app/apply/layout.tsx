import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply to join Vesper, a private, invite-only community of changemakers built around goal setting, accountability, and connection.",
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
