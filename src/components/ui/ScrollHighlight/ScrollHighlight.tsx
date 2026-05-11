import { useScroll } from "@/hooks/useScroll";

import style from "./ScrollHighlight.module.css";

type ScrollHighlightProps = {
  isVisible?: boolean;
  scrollElement: HTMLElement | null;
};

const ScrollHighlight = ({ isVisible = true, scrollElement }: ScrollHighlightProps) => {
  const { atTop, isScrollable } = useScroll({
    scrollElement: scrollElement,
  });

  const visible = isVisible && atTop && isScrollable;
  const combinedStyle = { "--overlay-opacity": visible ? 1 : 0 } as React.CSSProperties;

  return (
    <div className={style["scroll-container"]} style={combinedStyle}>
      <span className={style["scroll-highlight"]}></span>
      <span className={style["scroll-orbs"]}></span>
    </div>
  );
};

export default ScrollHighlight;
