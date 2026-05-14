import type { DeepPartial, Milliseconds, Pixels } from "./types";

export type Theme = "system" | "dark" | "light";
export type VerticalConstraint = {
  type: "off" | "full" | "margined";
  margin: Pixels;
};
export type Align = "left" | "center" | "right";
export type LiveUpdate = {
  enabled: boolean;
  debounce: Milliseconds;
};

export type PartialSettings = DeepPartial<Settings>;

export class Settings {
  theme: Theme = "system";
  verticalConstraint: VerticalConstraint = {
    type: "off",
    margin: 10,
  };
  align: Align = "center";
  liveUpdate: LiveUpdate = {
    enabled: false,
    debounce: 1000 / 60,
  };
}
