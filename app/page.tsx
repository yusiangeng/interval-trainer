"use client";

import dynamic from "next/dynamic";

const ClientOnlyComponent = dynamic(() => import("@/components/audio"), { ssr: false });

export default function MathDifferenceApp() {
  return <ClientOnlyComponent />;
}
