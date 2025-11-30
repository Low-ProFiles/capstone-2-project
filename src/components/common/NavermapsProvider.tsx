"use client";

import { NavermapsProvider } from "react-naver-maps";
import { ReactNode } from "react";

export default function CustomNavermapsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <NavermapsProvider
      ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID!}
      submodules={["geocoding"]}
    >
      {children}
    </NavermapsProvider>
  );
}
