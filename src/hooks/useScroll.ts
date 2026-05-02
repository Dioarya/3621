import { useState, useEffect } from "react";

type UseScrollResult = {
  atTop: boolean;
  scrollPercentage: number;
  isScrollable: boolean;
};

type UseScrollOptions = {
  scrollElement: HTMLElement | null;
};

export function useScroll({ scrollElement }: UseScrollOptions): UseScrollResult {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const percentage = scrollTop / (scrollHeight - clientHeight);
      setScrollPercentage(percentage);
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [scrollElement]);

  return {
    atTop: scrollPercentage === 0,
    scrollPercentage,
    isScrollable: scrollElement ? scrollElement.scrollHeight > scrollElement.clientHeight : false,
  };
}
