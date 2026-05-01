import { useSectionContext } from "../Provider/Provider";
import style from "../Section.module.css";
import Button from "./Button/Button";

export default function Navbar() {
  const ctx = useSectionContext();

  return (
    <div className={style["section-navbar"]}>
      {ctx.pages.map((page) => (
        <Button
          key={page.key}
          page={page}
          isSelected={ctx.selected === page.key}
          onSelect={ctx.setSelected}
        />
      ))}
    </div>
  );
}
