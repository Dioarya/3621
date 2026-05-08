import { ComponentPropsWithoutRef, ReactNode } from "react";

import style from "../../Section.module.css";

export type SectionContentPageProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "pageKey" | "pageLabel"
> & {
  children: ReactNode;
  pageKey: string;
  pageLabel: string;
};

const Page = ({ children }: SectionContentPageProps) => {
  return <section className={style.page}>{children}</section>;
};

export default Page;
