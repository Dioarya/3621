import { clsx } from "clsx";
import { forwardRef, ReactNode } from "react";

import style from "./Page.module.css";

type PageProps = Omit<React.ComponentPropsWithoutRef<"div">, "children" | "scrollable" | "ref"> & {
  children: ReactNode;
  scrollable?: boolean;
  hideScrollbar?: boolean;
};

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, scrollable = true, hideScrollbar = true, className, ...props }, ref) => {
    const combinedClassName = clsx(className, {
      [style["page-scrollable"]]: scrollable,
      [style["page"]]: !scrollable,
      [style["hide-scrollbar"]]: hideScrollbar,
    });
    return (
      <div {...props} ref={scrollable ? ref : undefined} className={combinedClassName}>
        {children}
      </div>
    );
  },
);

export default Page;
