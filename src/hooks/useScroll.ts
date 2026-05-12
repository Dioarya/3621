import { useState, useEffect } from "react";

type UseScrollOptions = {
  scrollElement: HTMLElement | null;
};

export function useScroll({ scrollElement }: UseScrollOptions) {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    if (import.meta.env.DEV)
      console.log(
        `[popup:scroll] log: scroll element ${scrollElement ? "attached" : "detached"} - scrollable=${scrollElement ? scrollElement.scrollHeight > scrollElement.clientHeight : false}`,
      );

    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const percentage = scrollTop / (scrollHeight - clientHeight);
      setScrollPercentage(percentage);
    };

    const observer = new ResizeObserver(handleScroll);
    observer.observe(scrollElement);
    scrollElement.childNodes.forEach((child) => {
      if (child instanceof Element) observer.observe(child);
    });

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [scrollElement]);

  return {
    atTop: scrollPercentage === 0,
    scrollPercentage,
    isScrollable: scrollElement ? scrollElement.scrollHeight > scrollElement.clientHeight : false,
  } as const;
}
