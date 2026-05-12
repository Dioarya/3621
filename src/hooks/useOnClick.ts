import { MouseEventHandler } from "react";

export function useOnClick<E extends HTMLElement>(
  value: boolean,
  onClick: (value: boolean) => void,
): MouseEventHandler<E>;
export function useOnClick<E extends HTMLElement>(
  value: boolean,
  onClick?: (value: boolean) => void,
) {
  if (onClick)
    return ((event) => {
      event.preventDefault();
      if (onClick) onClick(!value);
    }) as MouseEventHandler<E>;
}
