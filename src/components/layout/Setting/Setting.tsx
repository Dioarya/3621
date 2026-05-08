import clsx from "clsx";
import React, { type ReactNode } from "react";

import style from "./Setting.module.css";

type SettingLabelProps = { children: string };
type SettingLabelElement = React.ReactElement<SettingLabelProps, typeof Label>;
type SettingDescriptionProps = { children: string };
type SettingDescriptionElement = React.ReactElement<SettingDescriptionProps, typeof Description>;
type SettingInputProps = { children: ReactNode };
type SettingInputElement = React.ReactElement<SettingInputProps, typeof Input>;

type SettingChild = SettingLabelElement | SettingDescriptionElement | SettingInputElement;

const Label = ({ children }: SettingLabelProps) => {
  return <span>{children}</span>;
};

const Description = ({ children }: SettingDescriptionProps) => {
  return <span className={style.description}>{children}</span>;
};

const Input = ({ children }: SettingInputProps) => {
  return <span>{children}</span>;
};

type SettingProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
  children: SettingChild | SettingChild[];
};

const Setting = ({ children, className }: SettingProps) => {
  const childArray = React.Children.toArray(children) as React.ReactElement[];

  const label = childArray.find((c) => c.type === Label);
  const description = childArray.find((c) => c.type === Description);
  const input = childArray.find((c) => c.type === Input);

  const combinedClassName = clsx(style.setting, className);
  return (
    <span className={combinedClassName}>
      <div className={style.nameplate}>
        {label}
        {description}
      </div>
      {input}
    </span>
  );
};

Setting.Label = Label;
Setting.Description = Description;
Setting.Input = Input;

export default Setting;
