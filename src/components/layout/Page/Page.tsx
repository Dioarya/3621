import type { ReactNode, Ref } from "react";

import { clsx } from "clsx";

import style from "./Page.module.css";

type PageProps = Omit<React.ComponentPropsWithoutRef<"div">, "children" | "scrollable" | "ref"> & {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
  scrollable?: boolean;
  hideScrollbar?: boolean;
};

const Page = ({
  children,
  ref,
  className,
  scrollable = true,
  hideScrollbar = true,
  ...props
}: PageProps) => {
  const combinedClassName = clsx(style.page, className, {
    [style["scrollable"]]: scrollable,
    [style["hide"]]: hideScrollbar,
  });

  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export default Page;
