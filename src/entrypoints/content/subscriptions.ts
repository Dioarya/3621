import type { ContentScriptContext } from "#imports";

import { throttle } from "throttle-debounce";

import type { VerticalConstraint, Align, LiveUpdate, Settings } from "@/utils/settings";

import { disposableAddEventListener } from "@/utils/event";
import { exhaustiveStringTuple } from "@/utils/types";

import { runtimeObject } from ".";
import { useContentSettings } from "./store";

type HTMLElements = {
  image: HTMLElement;
  imageContainer: HTMLElement;
  alignContainer: HTMLElement;
};

type AlignCSS = `align-${Align}`;

function createApplyConstraint({ image, imageContainer }: HTMLElements) {
  function applyConstraint(verticalConstraint: VerticalConstraint) {
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

function createApplyAlignment({ alignContainer }: HTMLElements) {
  function applyAlignment(align: Align) {
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

function createApplyLiveUpdate(
  applyConstraint: ReturnType<typeof createApplyConstraint>,
  signal: AbortSignal,
) {
  function applyLiveUpdate(liveUpdate: LiveUpdate) {
    const createThrottle = () => {
      return throttle(
        1000 / 60,
        () => {
          const verticalConstraint = useContentSettings.getState().verticalConstraint;
          applyConstraint(verticalConstraint);
        },
        { noLeading: true },
      );
    };

    if (liveUpdate) {
      if (runtimeObject.throttleHandler) return; // LiveUpdate is already set-up
      const throttleHandler = createThrottle();
      runtimeObject.throttleHandler = throttleHandler;
      runtimeObject.eventCleanups = [
        disposableAddEventListener("scroll", throttleHandler, { signal, passive: true }),
        disposableAddEventListener("resize", throttleHandler, { signal }),
        disposableAddEventListener("orientationchange", throttleHandler, { signal }),
      ];
    } else {
      if (runtimeObject.throttleHandler) {
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

type ApplyFunctions = {
  applyConstraint: ReturnType<typeof createApplyConstraint>;
  applyAlignment: ReturnType<typeof createApplyAlignment>;
  applyLiveUpdate: ReturnType<typeof createApplyLiveUpdate>;
};

function createApplyFunctions(ctx: ContentScriptContext, elements: HTMLElements): ApplyFunctions {
  const applyConstraint = createApplyConstraint(elements);
  const applyAlignment = createApplyAlignment(elements);
  const applyLiveUpdate = createApplyLiveUpdate(applyConstraint, ctx.signal);
  return { applyConstraint, applyAlignment, applyLiveUpdate };
}

export function setupSubscriptions(
  ctx: ContentScriptContext,
  elements: HTMLElements,
): (() => void)[] {
  const unsubs: (() => void)[] = [];

  const { applyConstraint, applyAlignment, applyLiveUpdate } = createApplyFunctions(ctx, elements);

  unsubs.push(useContentSettings.subscribe((state) => state.verticalConstraint, applyConstraint));
  unsubs.push(useContentSettings.subscribe((state) => state.align, applyAlignment));
  unsubs.push(useContentSettings.subscribe((state) => state.liveUpdate, applyLiveUpdate));

  return unsubs;
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
