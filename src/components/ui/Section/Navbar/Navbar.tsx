import { useSectionContext } from "../Provider/Provider";
import style from "../Section.module.css";
import Button from "./Button/Button";
import ScrollButton from "./ScrollButton/ScrollButton";

const Navbar = () => {
  const ctx = useSectionContext();

  return (
    <div className={style.navbar}>
      <ScrollButton direction="left" onClick={ctx.scroll.scrollLeft} />
      <div className={style.wrapper}>
        <div className={style.pages}>
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
