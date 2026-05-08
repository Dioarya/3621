import clsx from "clsx";
import React, { ComponentPropsWithoutRef, useEffect } from "react";

import { Section } from "@/components";

import { useSectionContext } from "../Provider/Provider";
import { PageInfo } from "../types";
import { toPageInfo } from "../utils";
import style from "./Content.module.css";
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
    ctx.setPages(pageInfos);
  }, []);

  const wrapPage = (page: PageInfo) => {
    const hiddenClassName = clsx(style.content, style.hidden);
    const showClassName = clsx(style.content);
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

  return <div>{pageInfos.map(wrapPage)}</div>;
};

export default Content;
