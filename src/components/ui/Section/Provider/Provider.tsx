import { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { SectionContextType } from "../types";

const SectionContext = createContext<SectionContextType | null>(null);

type SectionProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: SectionProviderProps) {
  const [pages, setPages] = useState<SectionContextType["pages"]>([]);
  const [selected, setSelected] = useState<SectionContextType["selected"]>(null);

  const setPagesSafe: typeof setPages = (value) => {
    setPages((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      setSelected((currentSelected) =>
        currentSelected === null && next.length > 0 ? next[0].key : currentSelected,
      );
      return next;
    });
  };

  return (
    <SectionContext.Provider value={{ pages, setPages: setPagesSafe, selected, setSelected }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSectionContext() {
  const ctx = useContext(SectionContext);
  if (!ctx) throw new Error("Must be used inside SectionProvider");
  return ctx;
}
