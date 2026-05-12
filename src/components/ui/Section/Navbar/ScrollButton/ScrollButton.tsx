import Down from "@/assets/Arrows/down.svg?react";
import Left from "@/assets/Arrows/left.svg?react";
import Right from "@/assets/Arrows/right.svg?react";
import Up from "@/assets/Arrows/up.svg?react";

import style from "../../Section.module.css";

type ScrollButtonProps = {
  direction: "up" | "right" | "down" | "left";
  onClick: () => void;
  children?: never;
};

const ScrollButton = ({ direction, onClick: propOnClick }: ScrollButtonProps) => {
  const onClick = () => {
    if (import.meta.env.DEV)
      console.log(`[section:navbar] log: scroll button clicked - direction=${direction}`);
    propOnClick();
  };

  const svgMap = {
    up: Up,
    right: Right,
    down: Down,
    left: Left,
  };

  const Svg = svgMap[direction];
  return (
    <div className={style["scroll-button"]} onClick={onClick}>
      <Svg className={style.icon} />
    </div>
  );
};

export default ScrollButton;
