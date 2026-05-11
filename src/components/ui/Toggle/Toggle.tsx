import type { ReactNode } from "react";

import clsx from "clsx";

import style from "./Toggle.module.css";

type ToggleProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "role" | "type" | "checked" | "aria-checked" | "onChange" | "readOnly" | "aria-readonly"
> & {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  svg?: {
    off: ReactNode;
    on: ReactNode;
  };
};

const Toggle = ({ checked, onChange, svg, className, ...props }: ToggleProps) => {
  const thisOnChange = onChange ? () => onChange(!checked) : undefined;

  const combinedClassName = clsx(style.toggle, className, svg ? style["has-svg"] : undefined);
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
        onChange={thisOnChange}
        readOnly={!onChange}
        aria-readonly={!onChange}
      />
    </label>
  );
};

export default Toggle;
