import clsx from "clsx";
import { useEffect } from "react";

import { useOnClick } from "@/hooks/useOnClick";

import { useSectionContext } from "../Provider/Provider";
import style from "../Section.module.css";
import Button from "./Button/Button";
import Dropdown from "./Dropdown/Dropdown";
import ScrollButton from "./ScrollButton/ScrollButton";

type NavbarProps = Omit<React.ComponentPropsWithRef<"div">, "children" | "color" | "blur"> & {
  color?: string;
  blur?: string;
};

const Navbar = ({ color, blur }: NavbarProps) => {
  const ctx = useSectionContext();

  const dropdownOnClick = useOnClick(ctx.navbarShown, ctx.setNavbarShown);
  const dropdownDirection = ctx.navbarShown ? "up" : "down";

  useEffect(() => {
    if (import.meta.env.DEV)
      console.log(`[section:navbar] log: navbar ${ctx.navbarShown ? "shown" : "hidden"}`);
  }, [ctx.navbarShown]);

  if (color === undefined) color = "transparent";
  const combinedStyle = { "--bar-color": color, "--bar-blur": blur } as React.CSSProperties;
  const combinedClassName = clsx(style.navbar, !ctx.navbarShown && style.hidden);
  return (
    <>
      <Dropdown direction={dropdownDirection} onClick={dropdownOnClick} />
      <div className={combinedClassName} style={combinedStyle}>
        <ScrollButton direction="left" onClick={ctx.scroll.scrollLeft} />
        <div className={style.wrapper}>
          <div className={style["page-buttons"]}>
            {ctx.pages.map((page) => (
              <Button
                key={page.key}
                page={page}
                isSelected={ctx.selected === page.key}
                onSelect={ctx.setSelected}
              />
            ))}
          </div>
        </div>
        <ScrollButton direction="right" onClick={ctx.scroll.scrollRight} />
      </div>
    </>
  );
};

export default Navbar;
