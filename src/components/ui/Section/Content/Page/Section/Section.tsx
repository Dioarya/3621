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
    <section className={style.section}>
      <nav className={style.bar} onClick={onClick}>
        {label && <label className={style.label}>{label}</label>}
        <Dropdown className={style.dropdown} open={open} />
      </nav>
      <div className={combinedContentClassName}>{children}</div>
    </section>
  );
};

export default Section;
