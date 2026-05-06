import type { ContentScriptContext } from "wxt/utils/content-script-context";

import { createApplyFunctions, HTMLElements } from "./apply";
import { useContentSettings } from "./store";

export function setupSubscriptions(ctx: ContentScriptContext, elements: HTMLElements) {
  const unsubs: (() => void)[] = [];

  const { applyConstraint, applyAlignment, applyLiveUpdate } = createApplyFunctions(ctx, elements);

  unsubs.push(useContentSettings.subscribe((state) => state.verticalConstraint, applyConstraint));
  unsubs.push(useContentSettings.subscribe((state) => state.align, applyAlignment));
  unsubs.push(useContentSettings.subscribe((state) => state.liveUpdate, applyLiveUpdate));

  return unsubs;
}
