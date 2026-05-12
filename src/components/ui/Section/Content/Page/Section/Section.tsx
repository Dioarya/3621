import clsx from "clsx";
import { useState, type ReactNode } from "react";

import { Dropdown } from "@/components";
import { useOnClick } from "@/hooks/useOnClick";

import style from "../../../Section.module.css";

type SectionContentPageSectionProps = {
  children: ReactNode;
  label?: string;
};

const Section = ({ children, label }: SectionContentPageSectionProps) => {
  const [open, setOpen] = useState(false);
  const onClick = useOnClick(open, (next) => {
    if (import.meta.env.DEV)
      console.log(
        `[section:content] log: section "${label ?? "(unlabelled)"}" ${next ? "opened" : "closed"}`,
      );
    setOpen(next);
  });

  const combinedContentClassName = clsx(style.content, {
    [style.closed]: !open,
  });
  return (
    <div className={style.section}>
      <div className={style.bar} onClick={onClick}>
        {label && <span className={style.label}>{label}</span>}
        <Dropdown className={style.dropdown} open={open} />
      </div>
      <div className={combinedContentClassName}>{children}</div>
    </div>
  );
};

export default Section;
