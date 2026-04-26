import { ReactNode } from "react";
import styles from "./Navbar.module.css";

type NavbarProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function Navbar({ left, center, right }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div>{left}</div>
      <div className={styles.center}>{center}</div>
      <div>{right}</div>
    </nav>
  );
}
