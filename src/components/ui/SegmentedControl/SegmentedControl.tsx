import clsx from "clsx";
import React, { createContext, useContext } from "react";

import style from "./SegmentedControl.module.css";

type SegmentedControlContextType<T = any> = {
  value: T;
  onChange: (value: T) => void;
};

const segmentedControlContext = createContext<SegmentedControlContextType | null>(null);

type SegmentedControlRadioProps<T> = Omit<
  React.ComponentPropsWithoutRef<"label">,
  "children" | "value"
> & {
  children: React.ReactNode;
  value: T;
};
type SegmentedControlRadioElement<T> = React.ReactElement<
  SegmentedControlRadioProps<T>,
  typeof Radio
>;

type SegmentedControlChild<T> = SegmentedControlRadioElement<T>;

const Radio = <T,>({ children, value, ...props }: SegmentedControlRadioProps<T>) => {
  const ctx = useSegmentedControlContext();
  const cn = clsx(style.segment, { [style.selected]: ctx.value === value });
  return (
    <label className={cn} onClick={() => ctx.onChange(value)} {...props}>
      {children}
    </label>
  );
};

type SegmentedControlProps<T> = Omit<
  React.ComponentPropsWithoutRef<"fieldset">,
  "children" | "value" | "onChange"
> & {
  children: SegmentedControlChild<T> | SegmentedControlChild<T>[];
  value: T;
  onChange: (value: T) => void;
};

const SegmentedControl = <T,>({
  children,
  className,
  onChange,
  value,
  ...props
}: SegmentedControlProps<T>) => {
  const childArray = React.Children.toArray(children) as React.ReactElement[];
  const radios = childArray.filter((c) => c.type === Radio) as SegmentedControlRadioElement<T>[];
  const combinedClassName = clsx(style["segmented-control"], className);

  return (
    <segmentedControlContext.Provider value={{ onChange, value }}>
      <fieldset className={combinedClassName} {...props}>
        {radios}
      </fieldset>
    </segmentedControlContext.Provider>
  );
};

SegmentedControl.Radio = Radio;

export default SegmentedControl;

function useSegmentedControlContext() {
  const ctx = useContext(segmentedControlContext);
  if (ctx === null) {
    throw new Error("Must be used inside SegmentedControl");
  }
  return ctx;
}

type SegmentedControlRadio<T> = {
  label: string;
  value: T;
};

export function createSegmentedControl<T>(
  value: T,
  onChange: (value: T) => void,
  radios: SegmentedControlRadio<T>[],
) {
  return (
    <SegmentedControl value={value} onChange={onChange}>
      {radios.map((radio) => (
        <SegmentedControl.Radio
          key={radio.value as React.Key}
          value={radio.value}
          children={radio.label}
        />
      ))}
    </SegmentedControl>
  );
}
