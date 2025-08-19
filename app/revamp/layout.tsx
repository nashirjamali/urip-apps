import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URIP Revamp - Next Generation Trading",
  description: "Experience the future of tokenized asset trading with URIP's redesigned platform",
};

export default function RevampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="revamp-layout">
      {children}
    </div>
  );
}
