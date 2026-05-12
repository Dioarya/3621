import type { ContentScriptContext } from "wxt/utils/content-script-context";

import { createApplyFunctions, HTMLElements } from "./apply";
import { useContentSettings } from "./store";

export function setupSubscriptions(ctx: ContentScriptContext, elements: HTMLElements) {
  const unsubs: (() => void)[] = [];

  const { applyConstraint, applyAlignment, applyLiveUpdate } = createApplyFunctions(ctx, elements);

  if (import.meta.env.DEV)
    console.log(
      "[content:subscriptions] log: wiring up verticalConstraint, align, liveUpdate subscriptions",
    );

  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.verticalConstraint,
      (value) => {
        if (import.meta.env.DEV)
          console.log(`[content:subscriptions] log: verticalConstraint changed - ${value}`);
        applyConstraint(value);
      },
    ),
  );
  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.align,
      (value) => {
        if (import.meta.env.DEV)
          console.log(`[content:subscriptions] log: align changed - ${value}`);
        applyAlignment(value);
      },
    ),
  );
  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.liveUpdate,
      (value) => {
        if (import.meta.env.DEV)
          console.log(`[content:subscriptions] log: liveUpdate changed - ${value}`);
        applyLiveUpdate(value);
      },
    ),
  );

  return unsubs;
}
