import type { ContentScriptContext } from "wxt/utils/content-script-context";

import { throttle } from "throttle-debounce";

import type { VerticalConstraint, Align, LiveUpdate, Settings } from "@/utils/settings";

import { disposableAddEventListener } from "@/utils/event";

import { runtimeObject } from ".";
import { useContentSettings } from "./store";

export type HTMLElements = {
  image: HTMLElement;
  imageContainer: HTMLElement;
  alignContainer: HTMLElement;
};

function createApplyConstraint({ image, imageContainer }: HTMLElements) {
  function applyConstraint(verticalConstraint: VerticalConstraint) {
    if (import.meta.env.DEV)
      console.log(`[content:apply] log: verticalConstraint=${JSON.stringify(verticalConstraint)}`);
    switch (verticalConstraint.type) {
      case "off": {
        image.style.maxHeight = "";
        break;
      }

      case "full": {
        const parentTop = imageContainer.getBoundingClientRect().top;
        image.style.maxHeight = `calc(100vh - ${parentTop}px)`;
        break;
      }

      case "margined": {
        const parentTop = imageContainer.getBoundingClientRect().top;
        image.style.maxHeight = `calc(100vh - ${parentTop}px - ${verticalConstraint.margin}px)`;
        break;
      }
    }
  }
  return applyConstraint;
}

function createApplyAlignment({ alignContainer }: HTMLElements) {
  function applyAlignment(align: Align) {
    if (import.meta.env.DEV) console.log(`[content:apply] log: align=${align}`);
    type AlignCSS = `align-${Align}`;
    alignContainer.classList.remove(
      ...(["align-left", "align-center", "align-right"] satisfies AlignCSS[]),
    );
    alignContainer.classList.add(`align-${align}` satisfies AlignCSS);
  }
  return applyAlignment;
}

function createApplyLiveUpdate(
  ctx: ContentScriptContext,
  applyConstraint: ReturnType<typeof createApplyConstraint>,
) {
  function applyLiveUpdate(liveUpdate: LiveUpdate) {
    if (import.meta.env.DEV)
      console.log(`[content:apply] log: liveUpdate=${JSON.stringify(liveUpdate)}`);
    // Can't use lodash's throttle, because Function() calls break CSP
    const createThrottle = () => {
      return throttle(liveUpdate.debounce, () => {
        const verticalConstraint = useContentSettings.getState().data?.verticalConstraint;
        if (verticalConstraint) applyConstraint(verticalConstraint);
      });
    };

    if (liveUpdate.enabled) {
      if (runtimeObject.throttleHandler) {
        runtimeObject.throttleHandler.cancel();
      }

      const throttleHandler = createThrottle();
      runtimeObject.throttleHandler = throttleHandler;

      if (runtimeObject.eventCleanups) {
        runtimeObject.eventCleanups.forEach((cleanup) => cleanup());
      }

      const signal = ctx.signal;

      if (import.meta.env.DEV)
        console.log(
          "[content:apply] log: liveUpdate - registering scroll/resize/orientationchange listeners",
        );

      runtimeObject.eventCleanups = [
        disposableAddEventListener(document, "scroll", throttleHandler, { signal, passive: true }),
        disposableAddEventListener(document, "resize", throttleHandler, { signal }),
        disposableAddEventListener(window, "orientationchange", throttleHandler, { signal }),
      ];
    } else {
      if (runtimeObject.throttleHandler) {
        if (import.meta.env.DEV)
          console.log(
            "[content:apply] log: liveUpdate - cancelling throttle and removing listeners",
          );
        runtimeObject.throttleHandler.cancel();
        runtimeObject.throttleHandler = undefined;
      }

      if (runtimeObject.eventCleanups) {
        runtimeObject.eventCleanups.forEach((cleanup) => {
          cleanup();
        });
        runtimeObject.eventCleanups = undefined;
      }
    }
  }
  return applyLiveUpdate;
}

export function createApplyFunctions(ctx: ContentScriptContext, elements: HTMLElements) {
  const applyConstraint = createApplyConstraint(elements);
  const applyAlignment = createApplyAlignment(elements);
  const applyLiveUpdate = createApplyLiveUpdate(ctx, applyConstraint);
  return { applyConstraint, applyAlignment, applyLiveUpdate };
}

export function applySettings(
  ctx: ContentScriptContext,
  elements: HTMLElements,
  settings: Settings,
) {
  const { verticalConstraint, align } = settings;
  const { applyConstraint, applyAlignment, applyLiveUpdate } = createApplyFunctions(ctx, elements);
  applyConstraint(verticalConstraint);
  applyAlignment(align);
  applyLiveUpdate(verticalConstraint.liveUpdate);
}
