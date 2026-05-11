import { useSectionContext } from "../Provider/Provider";
import style from "../Section.module.css";
import Button from "./Button/Button";
import ScrollButton from "./ScrollButton/ScrollButton";

type NavbarProps = Omit<React.ComponentPropsWithRef<"div">, "children" | "color" | "blur"> & {
  color?: string;
  blur?: string;
};

const Navbar = ({ color, blur }: NavbarProps) => {
  const ctx = useSectionContext();

  if (color === undefined) color = "transparent";
  const combinedStyle = { "--bar-color": color, "--bar-blur": blur } as React.CSSProperties;

  return (
    <div className={style.navbar} style={combinedStyle}>
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
  );
};

export default Navbar;
