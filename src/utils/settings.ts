export type Theme = "system" | "dark" | "light";
export type VerticalConstraint = "off" | "full" | "margined";
export type Align = "left" | "center" | "right";
export type LiveUpdate = boolean;

/**
 * Full shape of the extension's settings - for documentation purposes only.
 * Use the individual types above for actual type annotations.
 */
export class Settings {
  theme: Theme = "system";
  verticalConstraint: VerticalConstraint = "off";
  align: Align = "center";
  liveUpdate: LiveUpdate = false;
}
