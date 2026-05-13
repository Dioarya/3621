import { storage, type WxtStorageItem } from "wxt/utils/storage";

import type { MultiKey, MultiValue, PlainObject } from "./multi";

import { getKeys, mapMulti, traverse } from "./multi";
import { Settings } from "./settings";

export type StorageItems<T extends object> = {
  [K in keyof T]: T[K] extends PlainObject ? StorageItems<T[K]> : WxtItem<T[K]>;
};

type WxtItem<T, M extends PlainObject = PlainObject> = WxtStorageItem<T, M>;

function build<T extends object>(ctor: new () => T) {
  return mapMulti(new ctor() as PlainObject, (key, value) =>
    storage.defineItem(`local:${key}`, {
      fallback: value,
    }),
  ) as StorageItems<T>;
}

class Storage<T extends object> {
  items: StorageItems<T>;
  keys: MultiKey<T>[];

  item<K extends MultiKey<T> & string>(key: MultiKey<StorageItems<T>>): WxtItem<MultiValue<T, K>> {
    return traverse(this.items, key) as WxtItem<MultiValue<T, K>>;
  }

  constructor(ctor: new () => T) {
    this.items = build(ctor) as StorageItems<T>;
    this.keys = getKeys(ctor) as MultiKey<T>[];
  }
}

export const settingsStorageItems = new Storage(Settings);
