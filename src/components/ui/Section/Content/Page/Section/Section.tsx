import { useState } from "#imports";
import clsx from "clsx";
import { type ReactNode } from "react";

import { Dropdown } from "@/components";
import { useOnClick } from "@/hooks/useOnClick";

import style from "./Section.module.css";

type SectionContentPageSectionProps = {
  children: ReactNode;
  label?: string;
};

const Section = ({ children, label }: SectionContentPageSectionProps) => {
  const [open, setOpen] = useState(false);
  const onClick = useOnClick(open, setOpen);

  const combinedContentClassName = clsx(style["section-content"], { [style.closed]: !open });
  return (
    <div className={style.section}>
      <div className={style["section-bar"]} onClick={onClick}>
        <Dropdown className={style["section-dropdown"]} open={open} />
        {label && <span className={style["section-label"]}>{label}</span>}
      </div>
      <div className={combinedContentClassName}>{children}</div>
    </div>
  );
};

export default Section;
