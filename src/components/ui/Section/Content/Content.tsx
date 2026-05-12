import clsx from "clsx";
import React, { ComponentPropsWithoutRef, useEffect } from "react";

import { Section } from "@/components";

import { useSectionContext } from "../Provider/Provider";
import style from "../Section.module.css";
import { PageInfo } from "../types";
import { toPageInfo } from "../utils";
import { SectionContentPageProps } from "./Page/Page";

type SectionContentChild = React.ReactElement<SectionContentPageProps>;

type SectionContentProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: SectionContentChild | SectionContentChild[];
};

const Content = ({ children }: SectionContentProps) => {
  const ctx = useSectionContext();

  const childrenArray = React.Children.toArray(children) as (
    | React.ReactElement
    | SectionContentChild
  )[];

  const pages = childrenArray.filter(
    (child) => child.type === Section.Content.Page,
  ) as SectionContentChild[];

  const pageInfos = pages.map((page) => toPageInfo({ page }));

  useEffect(() => {
    if (import.meta.env.DEV)
      console.log(
        `[section:content] log: registering ${pageInfos.length} page(s) - [${pageInfos.map((p) => p.key).join(", ")}]`,
      );
    ctx.setPages(pageInfos);
  }, []);

  const wrapPage = (page: PageInfo) => {
    const hiddenClassName = clsx(style["page-wrap"], style.hidden);
    const showClassName = clsx(style["page-wrap"]);
    if (page.key === ctx.selected) {
      return (
        <div key={page.key} className={showClassName}>
          {page.page}
        </div>
      );
    } else {
      return (
        <div key={page.key} className={hiddenClassName}>
          {page.page}
        </div>
      );
    }
  };

  return <div className={style.content}>{pageInfos.map(wrapPage)}</div>;
};

export default Content;
