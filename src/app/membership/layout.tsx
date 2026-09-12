import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "What Vesper membership includes: resources for goal setting and accountability, a supportive community, and a monthly in-person gathering.",
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
