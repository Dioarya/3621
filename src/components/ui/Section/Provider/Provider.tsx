import { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { SectionContextType } from "../types";

const SectionContext = createContext<SectionContextType | null>(null);

type SectionProviderProps = {
  children: ReactNode;
};

const Provider = ({ children }: SectionProviderProps) => {
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

  const currentSelectedIndex = () => {
    return pages
      .map((page, index) => ({ page, index }))
      .filter(({ page }) => page.key === selected)[0].index;
  };

  const selectIndex = (index: number) => {
    const key = pages[index].key;
    setSelected(key);
  };

  const scrollLeft = () => {
    const index = currentSelectedIndex();
    const nextIndex = index - 1;
    if (nextIndex >= 0) {
      selectIndex(nextIndex);
    }
  };

  const scrollRight = () => {
    const index = currentSelectedIndex();
    const length = pages.length;
    const nextIndex = index + 1;
    if (nextIndex <= length - 1) {
      selectIndex(nextIndex);
    }
  };

  const scroll = {
    scrollLeft,
    scrollRight,
  };

  return (
    <SectionContext.Provider
      value={{ pages, setPages: setPagesSafe, selected, setSelected, scroll }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export function useSectionContext() {
  const ctx = useContext(SectionContext);
  if (!ctx) throw new Error("Must be used inside SectionProvider");
  return ctx;
}

export default Provider;
