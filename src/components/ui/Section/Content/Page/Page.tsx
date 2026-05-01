import { ComponentPropsWithoutRef, ReactNode } from "react";

export type SectionContentPageProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "pageId" | "pageLabel"
> & {
  children: ReactNode;
  pageKey: string;
  pageLabel: string;
};

export default function Page({ children }: SectionContentPageProps) {
  return <section>{children}</section>;
}
