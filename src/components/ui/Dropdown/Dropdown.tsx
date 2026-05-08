import clsx from "clsx";
import { type MouseEventHandler } from "react";

import Closed from "@/assets/Dropdown/closed.svg?react";
import Open from "@/assets/Dropdown/open.svg?react";

import style from "./Dropdown.module.css";

type DropdownProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children" | "open" | "onClick"
> & {
  children?: never;
  open: boolean;
  onClick?: (open: boolean) => void;
};

const Dropdown = ({ open, onClick, className, ...props }: DropdownProps) => {
  const onClickProp: MouseEventHandler<HTMLSpanElement> | undefined = onClick
    ? (event) => {
        event.preventDefault();
        onClick(!open);
      }
    : undefined;

  const svgClassName = clsx(style.dropdown, open ? style.open : style.closed);

  return (
    <span className={clsx(style.container, className)} onClick={onClickProp} {...props}>
      {open ? <Open className={svgClassName} /> : <Closed className={svgClassName} />}
    </span>
  );
};

export default Dropdown;
