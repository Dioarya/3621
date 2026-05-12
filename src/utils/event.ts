import type { Browser } from "wxt/browser";
import type { WxtWindowEventMap } from "wxt/utils/content-script-context";
import type { ContentScriptContext } from "wxt/utils/content-script-context";

// Without ctx
export function disposableAddEventListener<TType extends keyof WxtWindowEventMap>(
  target: Window,
  type: TType,
  handler: (event: WxtWindowEventMap[TType]) => void,
  options?: AddEventListenerOptions | boolean,
): () => void;
export function disposableAddEventListener<TType extends keyof DocumentEventMap>(
  target: Document,
  type: TType,
  handler: (event: DocumentEventMap[TType]) => void,
  options?: AddEventListenerOptions | boolean,
): () => void;
export function disposableAddEventListener<TType extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: TType,
  handler: (event: HTMLElementEventMap[TType]) => void,
  options?: AddEventListenerOptions | boolean,
): () => void;

// With ctx
export function disposableAddEventListener<TType extends keyof WxtWindowEventMap>(
  target: Window,
  type: TType,
  handler: (event: WxtWindowEventMap[TType]) => void,
  options: AddEventListenerOptions | undefined,
  ctx: ContentScriptContext,
): () => void;
export function disposableAddEventListener<TType extends keyof DocumentEventMap>(
  target: Document,
  type: TType,
  handler: (event: DocumentEventMap[TType]) => void,
  options: AddEventListenerOptions | undefined,
  ctx: ContentScriptContext,
): () => void;
export function disposableAddEventListener<TType extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: TType,
  handler: (event: HTMLElementEventMap[TType]) => void,
  options: AddEventListenerOptions | undefined,
  ctx: ContentScriptContext,
): () => void;

/**
 * Creates an event listener on target, optionally uses wxt's `ContentScriptContext` for custom events.
 * Event listeners created with `ctx` are automatically passed in the context's abort signal.
 *
 * @param target - Target object, either `window`, `document`, or an `HTMLElement`
 * @param type - Type of event to listen to
 * @param handler - Event handler
 * @param options - `AddEventListenerOptions`
 * @param ctx - `ContentScriptContext` from wxt
 * @returns cleanup function
 */
export function disposableAddEventListener(
  target: Document | Window | HTMLElement,
  type: string,
  handler: EventListener,
  options?: AddEventListenerOptions | boolean,
  ctx?: ContentScriptContext,
): () => void {
  if (ctx) {
    ctx.addEventListener(target, type, handler, options);
  } else {
    target.addEventListener(type, handler, options);
  }

  // ctx uses target.addEventListener() under the hood so this is still valid cleanup
  return () => target.removeEventListener(type, handler, options);
}

type BrowserEvent<T extends (...args: any) => void> = Browser.events.Event<T>;

export function disposableBrowserListener<T extends (...args: any) => void>(
  event: BrowserEvent<T>,
  handler: T,
) {
  event.addListener(handler);
  return () => event.removeListener(handler);
}
