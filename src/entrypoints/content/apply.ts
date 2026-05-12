import { throttle } from "throttle-debounce";
import { ContentScriptContext } from "wxt/utils/content-script-context";

import type { VerticalConstraint, Align, LiveUpdate, Settings } from "@/utils/settings";

import { disposableAddEventListener } from "@/utils/event";
import { exhaustiveStringTuple } from "@/utils/types";

import { runtimeObject } from ".";
import { useContentSettings } from "./store";

export type HTMLElements = {
  image: HTMLElement;
  imageContainer: HTMLElement;
  alignContainer: HTMLElement;
};

type AlignCSS = `align-${Align}`;

export function createApplyConstraint({ image, imageContainer }: HTMLElements) {
  function applyConstraint(verticalConstraint: VerticalConstraint) {
    if (import.meta.env.DEV)
      console.log(`[content:apply] log: verticalConstraint=${verticalConstraint}`);
    switch (verticalConstraint) {
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
        image.style.maxHeight = `calc(100vh - ${parentTop}px - 10px)`;
        break;
      }
    }
  }
  return applyConstraint;
}

export function createApplyAlignment({ alignContainer }: HTMLElements) {
  function applyAlignment(align: Align) {
    if (import.meta.env.DEV) console.log(`[content:apply] log: align=${align}`);
    const allCssClasses = exhaustiveStringTuple<AlignCSS>()(
      "align-left",
      "align-center",
      "align-right",
    );
    alignContainer.classList.remove(...allCssClasses);
    const cssClass: AlignCSS = `align-${align}`;
    alignContainer.classList.add(cssClass);
  }
  return applyAlignment;
}

export function createApplyLiveUpdate(
  ctx: ContentScriptContext,
  applyConstraint: ReturnType<typeof createApplyConstraint>,
) {
  function applyLiveUpdate(liveUpdate: LiveUpdate) {
    if (import.meta.env.DEV) console.log(`[content:apply] log: liveUpdate=${liveUpdate}`);
    const createThrottle = () => {
      return throttle(
        1000 / 60,
        () => {
          const verticalConstraint = useContentSettings.getState().verticalConstraint;
          applyConstraint(verticalConstraint);
        },
        { noTrailing: true },
      );
    };

    if (liveUpdate) {
      if (runtimeObject.throttleHandler) return; // LiveUpdate is already set-up

      const throttleHandler = createThrottle();
      runtimeObject.throttleHandler = throttleHandler;

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
  const { verticalConstraint, align, liveUpdate } = settings;
  const { applyConstraint, applyAlignment, applyLiveUpdate } = createApplyFunctions(ctx, elements);
  applyConstraint(verticalConstraint);
  applyAlignment(align);
  applyLiveUpdate(liveUpdate);
}
