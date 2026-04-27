import { Settings } from "./settings";
const defaults = new Settings();

function createStorageItem<K extends keyof Settings>(k: K) {
  return storage.defineItem<Settings[K]>(`local:${k}`, {
    fallback: defaults[k],
  });
}

function createStorageItems() {
  const keys = Object.keys(defaults) as (keyof Settings)[];
  return Object.fromEntries(keys.map((k) => [k, createStorageItem(k)])) as {
    [K in keyof Settings]: ReturnType<typeof createStorageItem<K>>;
  };
}

export const storageItems = createStorageItems();
