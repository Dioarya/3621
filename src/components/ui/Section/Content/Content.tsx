import clsx from "clsx";
import React, { type ComponentPropsWithoutRef, useEffect } from "react";

import { Section } from "@/components";

import type { PageInfo } from "../types";
import type { SectionContentPageProps } from "./Page/Page";

import { useSectionContext } from "../Provider/Provider";
import style from "../Section.module.css";
import { toPageInfo } from "../utils";

type SectionContentChild = React.ReactElement<SectionContentPageProps>;

type SectionContentProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: SectionContentChild | SectionContentChild[];
};

const Content = ({ children }: SectionContentProps) => {
  const ctx = useSectionContext();

  const childrenArray = React.Children.toArray(children) as React.ReactElement[];
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
    const className = clsx(style["page-wrap"], { [style.hidden]: page.key !== ctx.selected });
    return (
      <div key={page.key} className={className}>
        {page.page}
      </div>
    );
  };

  return <div className={style.content}>{pageInfos.map(wrapPage)}</div>;
};

export default Content;
