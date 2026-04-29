import { version } from "@@/package.json";

export const MARKER_KEY = `__e6hancer_v${version}__` as const;

export function isAlreadyInjected(): boolean {
  return !!window[MARKER_KEY as unknown as keyof typeof window];
}

export function injectIsInjected(_MARKER_KEY: typeof MARKER_KEY): boolean {
  return !!window[_MARKER_KEY as unknown as keyof typeof window];
}

export function markAsInjected(): void {
  Object.defineProperty(window, MARKER_KEY, {
    value: true,
    writable: false,
    configurable: true,
    enumerable: false,
  });
}

export function clearInjectionMarker(): void {
  delete (window as unknown as Record<string, unknown>)[MARKER_KEY];
}
