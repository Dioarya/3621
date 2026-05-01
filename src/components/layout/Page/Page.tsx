import { clsx } from "clsx";
import { forwardRef, ReactNode } from "react";

import style from "./Page.module.css";

type PageProps = Omit<React.ComponentPropsWithoutRef<"div">, "children" | "scrollable"> & {
  children: ReactNode;
  scrollable?: boolean;
  hideScrollbar?: boolean;
};

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, scrollable = true, hideScrollbar = true, className, ...props }, ref) => {
    const mainClassName = scrollable ? style["page-scrollable"] : style["page"];
    return (
      <div
        {...props}
        ref={scrollable ? ref : undefined}
        className={clsx(mainClassName, className, { [style["hide-scrollbar"]]: hideScrollbar })}
      >
        {children}
      </div>
    );
  },
);

export default Page;
