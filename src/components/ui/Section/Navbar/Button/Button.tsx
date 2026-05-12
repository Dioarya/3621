import clsx from "clsx";
import { useEffect, useRef } from "react";

import type { PageInfo } from "../../types";

import style from "../../Section.module.css";

type SectionNavbarButtonProps = {
  isSelected: boolean;
  page: PageInfo;
  onSelect: (key: string) => void;
};

const Button = ({ isSelected, page, onSelect }: SectionNavbarButtonProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const onClick = () => {
    if (import.meta.env.DEV)
      console.log(`[section:navbar] log: page button clicked: key=${page.key}`);
    onSelect(page.key);
  };

  useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [isSelected]);

  const combinedClassName = clsx(style.button, { [style.selected]: isSelected });
  return (
    <span ref={ref} className={combinedClassName} onClick={onClick}>
      {page.label}
    </span>
  );
};

export default Button;
