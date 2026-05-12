import type { MouseEventHandler } from "react";

import Down from "@/assets/Chevron/down.svg?react";
import Up from "@/assets/Chevron/up.svg?react";

import style from "../../Section.module.css";

type SectionNavbarDropdownProps = {
  direction: "up" | "down";
  onClick: MouseEventHandler<HTMLElement>;
  children?: never;
};

const Dropdown = ({ direction, onClick }: SectionNavbarDropdownProps) => {
  const svgMap = {
    up: Up,
    down: Down,
  };

  const Svg = svgMap[direction];

  return (
    <div className={style["nav-dropdown"]} onClick={onClick}>
      <Svg className={style.icon} />
    </div>
  );
};

export default Dropdown;
