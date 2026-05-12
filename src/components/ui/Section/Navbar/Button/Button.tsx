import clsx from "clsx";
import { useEffect, useRef } from "react";

import style from "../../Section.module.css";
import { PageInfo } from "../../types";

type SectionNavbarButtonProps = {
  isSelected: boolean;
  page: PageInfo;
  onSelect: (key: string) => void;
};

const Button = ({ isSelected, page, onSelect }: SectionNavbarButtonProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [isSelected]);

  return (
    <span
      ref={ref}
      className={clsx(style.button, { [style.selected]: isSelected })}
      onClick={() => {
        if (import.meta.env.DEV)
          console.log(`[section:navbar] log: page button clicked: key=${page.key}`);
        onSelect(page.key);
      }}
    >
      {page.label}
    </span>
  );
};

export default Button;
