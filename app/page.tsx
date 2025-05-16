"use client";

import dynamic from "next/dynamic";

const ClientOnlyGame = dynamic(() => import("@/components/game"), { ssr: false });

export default function () {
  return <ClientOnlyGame />;
}
