import type { ReactNode } from "react";

import style from "./Bar.module.css";

type BarProps = Omit<React.ComponentPropsWithRef<"nav">, "children"> & {
  children: ReactNode;
  color?: string;
  blur?: string;
};

type BarSegmentProps = Omit<React.ComponentPropsWithRef<"div">, "children"> & {
  children: ReactNode;
};

function Left({ children }: BarSegmentProps) {
  return <div>{children}</div>;
}

function Center({ children }: BarSegmentProps) {
  return <div className={style.center}>{children}</div>;
}

function Right({ children }: BarSegmentProps) {
  return <div>{children}</div>;
}

export default function Bar({ children, color, blur }: BarProps) {
  if (color === undefined) {
    color = "transparent";
  }
  return (
    <nav
      className={style.bar}
      style={{ "--bar-color": color, "--bar-blur": blur } as React.CSSProperties}
    >
      {children}
    </nav>
  );
}

Bar.Left = Left;
Bar.Center = Center;
Bar.Right = Right;
