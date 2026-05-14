import type { ContentScriptContext } from "wxt/utils/content-script-context";

import { type ApplyFunctions } from "./apply";
import { useContentSettings } from "./store";

export function setupSubscriptions(_ctx: ContentScriptContext, fns: ApplyFunctions) {
  const unsubs: (() => void)[] = [];

  const { applyConstraint, applyAlignment, applyLiveUpdate, applyHideTopAd } = fns;

  if (import.meta.env.DEV)
    console.log(
      "[content:subscriptions] log: wiring up verticalConstraint, align, liveUpdate, hideTopAd subscriptions",
    );

  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.data?.verticalConstraint,
      (value) => {
        if (!value) return;
        if (import.meta.env.DEV)
          console.log(
            `[content:subscriptions] log: verticalConstraint changed - ${JSON.stringify(value)}`,
          );
        applyConstraint(value);
      },
    ),
  );
  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.data?.align,
      (value) => {
        if (!value) return;
        if (import.meta.env.DEV)
          console.log(`[content:subscriptions] log: align changed - ${value}`);
        applyAlignment(value);
      },
    ),
  );
  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.data?.verticalConstraint?.liveUpdate,
      (value) => {
        if (!value) return;
        if (import.meta.env.DEV)
          console.log(`[content:subscriptions] log: liveUpdate changed - ${JSON.stringify(value)}`);
        applyLiveUpdate(value);
      },
    ),
  );
  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.data?.hideTopAd,
      (value) => {
        if (value === undefined) return;
        if (import.meta.env.DEV)
          console.log(`[content:subscriptions] log: hideTopAd changed - ${value}`);
        applyHideTopAd(value);
      },
    ),
  );

  return unsubs;
}
