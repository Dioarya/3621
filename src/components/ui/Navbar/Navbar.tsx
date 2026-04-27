import { ReactNode } from "react";
import styles from "./Navbar.module.css";

function Navbar({ children }: { children: ReactNode }) {
  return <nav className={styles.navbar}>{children}</nav>;
}

Navbar.Left = function NavbarLeft({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
};

Navbar.Center = function NavbarCenter({ children }: { children: ReactNode }) {
  return <div className={styles.center}>{children}</div>;
};

Navbar.Right = function NavbarRight({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
};

export default Navbar;
