import NavButton from "../NavButton/NavButton";
import { useSectionContext } from "../Provider/Provider";
import style from "../Section.module.css";

export default function Navbar() {
  const ctx = useSectionContext();

  return (
    <div className={style["section-navbar"]}>
      {ctx.pages.map((page) => (
        <NavButton
          key={page.key}
          page={page}
          isSelected={ctx.selected === page.key}
          onSelect={ctx.setSelected}
        />
      ))}
    </div>
  );
}
