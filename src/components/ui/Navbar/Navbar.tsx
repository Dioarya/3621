import type { ReactNode } from "react";

import style from "./Navbar.module.css";

function Navbar({ children }: { children: ReactNode }) {
  return <nav className={style.navbar}>{children}</nav>;
}

Navbar.Left = function NavbarLeft({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
};

Navbar.Center = function NavbarCenter({ children }: { children: ReactNode }) {
  return <div className={style.center}>{children}</div>;
};

Navbar.Right = function NavbarRight({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
};

export default Navbar;
