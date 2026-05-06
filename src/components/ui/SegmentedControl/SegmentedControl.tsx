import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import { segmentedControlContext, useSegmentedControlContext } from "./hook";
import style from "./SegmentedControl.module.css";

type SegmentedControlRadioProps<T> = Omit<
  React.ComponentPropsWithoutRef<"span">,
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

function Radio<T>({ children, value, ...props }: SegmentedControlRadioProps<T>) {
  const ctx = useSegmentedControlContext();
  const wrapCombinedClassName = clsx(style.wrap, { [style.selected]: ctx.value === value });
  const segmentCombinedClassName = clsx(style.segment, { [style.selected]: ctx.value === value });
  return (
    <span className={wrapCombinedClassName}>
      <label className={segmentCombinedClassName}>
        <input
          type="radio"
          checked={ctx.value === value}
          onChange={() => ctx.onChange(value)}
          {...props}
        />
        {children}
      </label>
    </span>
  );
}

type SegmentedControlProps<T> = Omit<
  React.ComponentPropsWithoutRef<"fieldset">,
  "children" | "value" | "onChange"
> & {
  children: SegmentedControlChild<T> | SegmentedControlChild<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function SegmentedControl<T>({
  children,
  className,
  onChange,
  value,
  ...props
}: SegmentedControlProps<T>) {
  const childArray = React.Children.toArray(children) as React.ReactElement[];
  const radios = childArray.filter((c) => c.type === Radio) as SegmentedControlRadioElement<T>[];
  const combinedClassName = clsx(style["segmented-control"], className);

  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const container = fieldsetRef.current;
    if (!container) return;

    function fillRows() {
      container!.querySelectorAll(`.${style["row-spacer"]}`).forEach((s) => s.remove());
      const children = Array.from(container!.children) as HTMLElement[];
      const rows = Map.groupBy(children, (child) => child.offsetTop);

      rows.forEach((row) => {
        const spacer = document.createElement("span");
        spacer.className = style["row-spacer"];
        row[row.length - 1].insertAdjacentElement("afterend", spacer);
      });
    }

    const observer = new ResizeObserver(fillRows);
    observer.observe(container);
    fillRows();

    return () => observer.disconnect();
  }, []);

  return (
    <segmentedControlContext.Provider value={{ onChange, value }}>
      <fieldset className={combinedClassName} ref={fieldsetRef} {...props}>
        {radios}
      </fieldset>
    </segmentedControlContext.Provider>
  );
}

SegmentedControl.Radio = Radio;
