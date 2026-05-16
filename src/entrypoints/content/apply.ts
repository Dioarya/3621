import type { ContentScriptContext } from "wxt/utils/content-script-context";

import { throttle } from "throttle-debounce";

import type { VerticalConstraint, Align, Settings, HideTopAd } from "@/utils/settings";

import { disposableAddEventListener } from "@/utils/event";

import { runtimeObject } from ".";
import { useContentSettings } from "./store";

export type HTMLElements = {
  image: HTMLElement;
  imageContainer: HTMLElement;
  alignContainer: HTMLElement;
  adTop: HTMLElement;
  adBottom: HTMLElement;
  adScape: HTMLElement;
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
  function applyLiveUpdate(liveUpdate: VerticalConstraint["liveUpdate"]) {
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

function withPrev<T>(fn: (value: T, prev: T | undefined) => void): (value: T) => void {
  let prev: T | undefined;
  return (value: T) => {
    fn(value, prev);
    prev = value;
  };
}

export function createApplyHideTopAd({ adTop, adBottom, adScape }: HTMLElements) {
  let originalParent: HTMLElement | null = null;
  let originalNextSibling: HTMLElement | null = null;

  const applyHideTopAd = withPrev<HideTopAd>((moveTopAd, prev) => {
    if (moveTopAd && !prev) {
      if (adTop && adScape && adBottom && adScape.contains(adBottom)) {
        originalParent = adTop.parentElement;
        originalNextSibling = adTop.nextElementSibling as HTMLElement | null;
        adScape.insertBefore(adTop, adBottom);
        if (import.meta.env.DEV)
          console.log("[content] log: moved #ad-leaderboard-top into .adscape");
      }
    } else if (!moveTopAd && prev) {
      if (
        adTop &&
        originalParent &&
        (!originalNextSibling || originalParent.contains(originalNextSibling))
      ) {
        if (originalNextSibling) {
          originalParent.insertBefore(adTop, originalNextSibling);
        } else {
          originalParent.appendChild(adTop);
        }
        if (import.meta.env.DEV)
          console.log("[content] log: restored #ad-leaderboard-top to original position");
      }
    }
  });

  return applyHideTopAd;
}

export type ApplyFunctions = {
  applyConstraint: ReturnType<typeof createApplyConstraint>;
  applyAlignment: ReturnType<typeof createApplyAlignment>;
  applyLiveUpdate: ReturnType<typeof createApplyLiveUpdate>;
  applyHideTopAd: ReturnType<typeof createApplyHideTopAd>;
};

export function createApplyFunctions(ctx: ContentScriptContext, elements: HTMLElements) {
  const applyConstraint = createApplyConstraint(elements);
  const applyAlignment = createApplyAlignment(elements);
  const applyLiveUpdate = createApplyLiveUpdate(ctx, applyConstraint);
  const applyHideTopAd = createApplyHideTopAd(elements);
  return {
    applyConstraint,
    applyAlignment,
    applyLiveUpdate,
    applyHideTopAd,
  } satisfies ApplyFunctions;
}

export function applySettings(settings: Settings, fns: ApplyFunctions) {
  const { verticalConstraint, align, hideTopAd } = settings;
  const { applyConstraint, applyAlignment, applyLiveUpdate, applyHideTopAd } = fns;
  applyHideTopAd(hideTopAd);
  applyConstraint(verticalConstraint);
  applyAlignment(align);
  applyLiveUpdate(verticalConstraint.liveUpdate);
}
