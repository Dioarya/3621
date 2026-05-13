import type { Milliseconds, Pixels } from "./types";

export type Theme = "system" | "dark" | "light";
export type VerticalConstraint = "off" | "full" | "margined";
export type Align = "left" | "center" | "right";
export type LiveUpdate = {
  enabled: boolean;
  debounce: Milliseconds;
  space: Pixels;
};

/**
 * Full shape of the extension's settings - for documentation purposes only.
 * Use the individual types above for actual type annotations.
 */
export class Settings {
  theme: Theme = "system";
  verticalConstraint: VerticalConstraint = "off";
  align: Align = "center";
  liveUpdate: LiveUpdate = {
    enabled: false,
    debounce: 1000 / 60,
    space: 10,
  };
}
