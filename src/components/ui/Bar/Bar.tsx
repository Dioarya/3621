import type { ReactNode } from "react";

import React from "react";

import style from "./Bar.module.css";

type BarProps = Omit<React.ComponentPropsWithRef<"div">, "children"> & {
  children: ReactNode;
  color?: string;
  blur?: string;
};

type BarSegmentProps = Omit<React.ComponentPropsWithRef<"div">, "children"> & {
  children: ReactNode;
};

const Left = ({ children }: BarSegmentProps) => {
  return <div className={style.left}>{children}</div>;
};

const Center = ({ children }: BarSegmentProps) => {
  return <div className={style.center}>{children}</div>;
};

const Right = ({ children }: BarSegmentProps) => {
  return <div className={style.right}>{children}</div>;
};

const Bar = ({ children, color, blur }: BarProps) => {
  if (color === undefined) color = "transparent";
  const combinedStyle = { "--bar-color": color, "--bar-blur": blur } as React.CSSProperties;

  const childArray = React.Children.toArray(children) as React.ReactElement[];

  const left = childArray.find((c) => c.type === Left);
  const center = childArray.find((c) => c.type === Center);
  const right = childArray.find((c) => c.type === Right);

  return (
    <div className={style.bar} style={combinedStyle}>
      {left}
      {center}
      {right}
    </div>
  );
};

Bar.Left = Left;
Bar.Center = Center;
Bar.Right = Right;

export default Bar;
