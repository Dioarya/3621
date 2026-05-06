import { version } from "@@/package.json";

// uses package.json's version instead of __VERSION__ because can't slug
export const MARKER_KEY = `__e6hancer_v${version}__` as const;

export function isInjected() {
  return !!window[MARKER_KEY as unknown as keyof typeof window];
}

export function injectIsInjected(_MARKER_KEY: typeof MARKER_KEY) {
  return !!window[_MARKER_KEY as unknown as keyof typeof window];
}

export function markAsInjected() {
  Object.defineProperty(window, MARKER_KEY, {
    value: true,
    writable: false,
    configurable: true,
    enumerable: false,
  });
}

export function clearInjectionMarker() {
  delete (window as unknown as Record<string, unknown>)[MARKER_KEY];
}
