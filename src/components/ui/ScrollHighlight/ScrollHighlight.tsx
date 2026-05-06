import { useRef, useEffect, useState } from "react";

import { useScroll } from "@/hooks/useScroll";

import style from "./ScrollHighlight.module.css";

function getScrollableParent(element: HTMLElement | null) {
  if (!element) return null;
  if (element.scrollHeight > element.clientHeight) return element;
  return getScrollableParent(element.parentElement);
}

type ScrollHighlightProps = {
  isVisible?: boolean;
  scrollElement?: HTMLElement | null;
};

export default function ScrollHighlight({ isVisible = true, scrollElement }: ScrollHighlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inferredScrollElement, setInferredScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollElement) return;
    setInferredScrollElement(getScrollableParent(ref.current?.parentElement ?? null));
  }, [scrollElement]);

  const { atTop, isScrollable } = useScroll({
    scrollElement: scrollElement ?? inferredScrollElement,
  });

  const visible = isVisible && atTop && isScrollable;
  const combinedStyle = { "--overlay-opacity": visible ? 1 : 0 } as React.CSSProperties;

  return (
    <div ref={ref} className={style["scroll-container"]} style={combinedStyle}>
      <span className={style["scroll-highlight"]}></span>
      <span className={style["scroll-orbs"]}></span>
    </div>
  );
}
