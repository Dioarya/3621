import { useRef, useEffect, useState } from "react";

import { useScroll } from "@/hooks/useScroll";

import style from "./ScrollHighlight.module.css";

function getScrollableParent(element: HTMLElement | null): HTMLElement | null {
  if (!element) return null;
  if (element.scrollHeight > element.clientHeight) return element;
  return getScrollableParent(element.parentElement);
}

type ScrollHighlightProps = {
  isVisible?: boolean;
  scrollElement?: HTMLElement | null;
};

export default function ScrollHighlight({
  isVisible = true,
  scrollElement: scrollElementProp,
}: ScrollHighlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inferredScrollElement, setInferredScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollElementProp) return;
    setInferredScrollElement(getScrollableParent(ref.current?.parentElement ?? null));
  }, [scrollElementProp]);

  const { atTop, isScrollable } = useScroll({
    scrollElement: scrollElementProp ?? inferredScrollElement,
  });

  const visible = isVisible && atTop && isScrollable;

  return (
    <div
      ref={ref}
      className={style["scroll-container"]}
      style={{ "--overlay-opacity": visible ? 1 : 0 } as React.CSSProperties}
    >
      <span className={style["scroll-highlight"]}></span>
      <span className={style["scroll-orbs"]}></span>
    </div>
  );
}
