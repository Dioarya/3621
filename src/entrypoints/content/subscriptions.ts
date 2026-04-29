import type { VerticalConstraint, Align, Settings } from "@/utils/settings";

import { exhaustiveStringTuple } from "@/utils/types";

import { useContentSettings } from "./store";

type HTMLElements = {
  image: HTMLElement;
  imageContainer: HTMLElement;
  alignContainer: HTMLElement;
};

type AlignCSS = `align-${Align}`;

function applyConstraint(
  { image, imageContainer }: HTMLElements,
  verticalConstraint: VerticalConstraint,
) {
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

function applyAlignment({ alignContainer }: HTMLElements, align: Align) {
  const allCssClasses = exhaustiveStringTuple<AlignCSS>()(
    "align-left",
    "align-center",
    "align-right",
  );
  alignContainer.classList.remove(...allCssClasses);
  const cssClass: AlignCSS = `align-${align}`;
  alignContainer.classList.add(cssClass);
}

export function setupSubscriptions(elements: HTMLElements): (() => void)[] {
  const unsubs: (() => void)[] = [];
  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.verticalConstraint,
      (verticalConstraint) => applyConstraint(elements, verticalConstraint),
    ),
  );

  unsubs.push(
    useContentSettings.subscribe(
      (state) => state.align,
      (align) => applyAlignment(elements, align),
    ),
  );

  return unsubs;
}

export function applySettings(elements: HTMLElements, settings: Settings) {
  applyConstraint(elements, settings.verticalConstraint);
  applyAlignment(elements, settings.align);
}
