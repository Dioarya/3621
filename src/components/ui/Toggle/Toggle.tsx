import type { ReactNode } from "react";

import clsx from "clsx";

import style from "./Toggle.module.css";

type ToggleProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "role" | "type" | "checked" | "aria-checked" | "onChange" | "readOnly" | "aria-readOnly"
> & {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  svg?: {
    off: ReactNode;
    on: ReactNode;
  };
};

export default function Toggle({ checked, onChange, svg, className, ...props }: ToggleProps) {
  const combinedClassName = clsx(style.toggle, className, { [style["has-svg"]]: svg });
  return (
    <label className={combinedClassName}>
      {svg && (
        <span className={style.knob}>
          <span className={style["svg-off"]}>{svg.off}</span>
          <span className={style["svg-on"]}>{svg.on}</span>
        </span>
      )}
      <input
        {...props}
        role="switch"
        type="checkbox"
        checked={checked}
        aria-checked={checked}
        onChange={onChange ? () => onChange(!checked) : undefined}
        readOnly={!onChange}
      />
    </label>
  );
}
