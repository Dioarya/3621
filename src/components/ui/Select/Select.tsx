import clsx from "clsx";

import ChevronDown from "@/assets/Chevron/down.svg?react";

import style from "./Select.module.css";

type SelectOption<T> = {
  label: string;
  value: T;
};

type SelectProps<T> = Omit<
  React.ComponentPropsWithoutRef<"select">,
  "children" | "value" | "onChange"
> & {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
};

const Select = <T extends string | number>({
  value,
  onChange,
  options,
  className,
  ...props
}: SelectProps<T>) => {
  const label = options.find((o) => o.value === value)?.label ?? "";

  return (
    <span className={clsx(style.container, className)} data-content={label}>
      <select
        value={value}
        onChange={(e) => onChange(options[Number(e.target.options.selectedIndex)].value)}
        {...props}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className={style.chevron} />
    </span>
  );
};

export default Select;
