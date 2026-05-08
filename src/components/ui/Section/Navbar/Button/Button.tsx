import clsx from "clsx";
import { ReactNode } from "react";

import style from "../../Section.module.css";
import { PageInfo } from "../../types";

type SectionNavbarButtonProps = {
  children?: ReactNode;
  isSelected: boolean;
  page: PageInfo;
  onSelect: (key: string) => void;
};

const Button = ({ isSelected, page, onSelect }: SectionNavbarButtonProps) => {
  const label = `${page.label}`;

  const combinedClassName = clsx(style.button, { [style.selected]: isSelected });
  return (
    <span className={combinedClassName} onClick={() => onSelect(page.key)}>
      {label}
    </span>
  );
};

export default Button;
