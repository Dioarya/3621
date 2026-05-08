import { ReactNode } from "react";

import style from "./Navbar.module.css";

type NavbarProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
};

const Navbar = ({ children, ...props }: NavbarProps) => {
  return (
    <div {...props} className={style.navbar}>
      {children}
    </div>
  );
};

export default Navbar;
