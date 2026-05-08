import { ComponentPropsWithoutRef, ReactNode } from "react";

export type SectionContentPageProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "pageId" | "pageLabel"
> & {
  children: ReactNode;
  pageKey: string;
  pageLabel: string;
};

const Page = ({ children }: SectionContentPageProps) => {
  return <section>{children}</section>;
};

export default Page;
