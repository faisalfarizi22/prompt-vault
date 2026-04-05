"use client";

import { createContext, useContext } from "react";

export interface DashboardCtx {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
}

export const DashboardContext = createContext<DashboardCtx>({
  activeCategory: "All",
  setActiveCategory: () => {},
  searchQuery: "",
});

export function useDashboard() {
  return useContext(DashboardContext);
}
