import { storage } from "wxt/utils/storage";

import { Settings } from "./settings";

function createStorageItem<T, K extends keyof T>(k: K, instance: T) {
  return storage.defineItem<T[K]>(`local:${String(k)}`, {
    fallback: instance[k],
  });
}

function createStorageItems<T extends object>(cls: new () => T) {
  const instance = new cls();
  const keys = Object.keys(instance) as (keyof T)[];
  return Object.fromEntries(keys.map((k) => [k, createStorageItem(k, instance)])) as {
    [K in keyof T]: ReturnType<typeof createStorageItem<T, K>>;
  };
}

export const settingsStorageItems = createStorageItems(Settings);
