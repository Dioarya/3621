import type { DeepPartial, Milliseconds, Pixels } from "./types";

export type Theme = "system" | "dark" | "light";
export type LiveUpdate = {
  enabled: boolean;
  debounce: Milliseconds;
};

export type VerticalConstraint = {
  type: "off" | "full" | "margined";
  margin: Pixels;
  liveUpdate: LiveUpdate;
};
export type Align = "left" | "center" | "right";

export type PartialSettings = DeepPartial<Settings>;

export class Settings {
  theme: Theme = "system";
  verticalConstraint: VerticalConstraint = {
    type: "off",
    margin: 10,
    liveUpdate: {
      enabled: false,
      debounce: 100,
    },
  };
  align: Align = "center";
}
