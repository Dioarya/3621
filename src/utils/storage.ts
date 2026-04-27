import { Settings } from "./settings";
const defaults = new Settings();

export const storageItems = {
  theme: storage.defineItem<Theme>("local:theme", {
    fallback: defaults.theme,
  }),
  verticalConstraint: storage.defineItem<VerticalConstraint>("local:verticalConstraint", {
    fallback: defaults.verticalConstraint,
  }),
  align: storage.defineItem<Align>("local:align", {
    fallback: defaults.align,
  }),
  liveUpdate: storage.defineItem<LiveUpdate>("local:liveUpdate", {
    fallback: defaults.liveUpdate,
  }),
};
