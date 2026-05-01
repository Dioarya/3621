import clsx from "clsx";
import { ReactNode } from "react";

import style from "../../Section.module.css";
import { PageInfo } from "../../types";

type SectionNavButtonProps = {
  children?: ReactNode;
  isSelected: boolean;
  page: PageInfo;
  onSelect: (key: string) => void;
};

export default function NavButton({ isSelected, page, onSelect }: SectionNavButtonProps) {
  const label = `${page.label} `;

  const combinedClassName = clsx(style["section-navbutton"], { [style["selected"]]: isSelected });
  return (
    <span className={combinedClassName} onClick={() => onSelect(page.key)}>
      {label}
    </span>
  );
}
