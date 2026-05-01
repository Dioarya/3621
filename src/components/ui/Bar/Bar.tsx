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

function Bar({ children, color, blur }: BarProps) {
  if (color === undefined) {
    color = "transparent";
  }
  return (
    <nav
      className={style.navbar}
      style={{ "--bar-color": color, "--bar-blur": blur } as React.CSSProperties}
    >
      {children}
    </nav>
  );
}

Bar.Left = function NavbarLeft({ children }: BarSegmentProps) {
  return <div>{children}</div>;
};

Bar.Center = function NavbarCenter({ children }: BarSegmentProps) {
  return <div className={style.center}>{children}</div>;
};

Bar.Right = function NavbarRight({ children }: BarSegmentProps) {
  return <div>{children}</div>;
};

export default Bar;
