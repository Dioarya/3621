import React, { ComponentPropsWithoutRef, useEffect } from "react";

import { Section } from "@/components";

import { useSectionContext } from "../Provider/Provider";
import { toPageInfo } from "../utils";
import { SectionContentPageProps } from "./Page/Page";

export type SectionContentChild = React.ReactElement<SectionContentPageProps>;

type SectionContentProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: SectionContentChild | SectionContentChild[];
};

export default function Content({ children }: SectionContentProps) {
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

  const selectedPage = pageInfos.find((p) => p.key === ctx.selected);
  return <div>{selectedPage?.page}</div>;
}
