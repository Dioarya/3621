export type PlainObject = Record<string, unknown>;

export type StringKey<T> = Extract<keyof T, string>;
export type DotlessStringKey<T> = Exclude<StringKey<T>, `${string}.${string}`>;

export type AssertNoDotKeys<T extends object> =
  Extract<StringKey<T>, `${string}.${string}`> extends never ? T : never;

export type MultiKey<T extends object> = _MultiKey<AssertNoDotKeys<T>, "">;
export type MultiKeyFlat<T extends object> = _MultiKeyFlat<AssertNoDotKeys<T>, "">;

type _MultiKey<T extends object, Prefix extends string = ""> = {
  [K in StringKey<T>]: T[K] extends PlainObject
    ? _MultiKey<AssertNoDotKeys<T[K]>, `${Prefix}${K}.`>
    : `${Prefix}${K}`;
};

type _MultiKeyFlat<T extends object, Prefix extends string = ""> = {
  [K in StringKey<T>]: T[K] extends PlainObject
    ? _MultiKeyFlat<AssertNoDotKeys<T[K]>, `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[StringKey<T>];

export type KeyPathTuple<T extends PlainObject> = {
  [K in StringKey<T>]: T[K] extends PlainObject ? [K] | [K, ...KeyPathTuple<T[K]>] : [K];
}[StringKey<T>];

export type MultiValue<
  T extends object,
  Path extends MultiKeyFlat<T> & string,
> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends StringKey<T>
    ? T[Head] extends PlainObject
      ? MultiValue<T[Head], Extract<Rest, MultiKeyFlat<T[Head]>>>
      : never
    : never
  : Path extends StringKey<T>
    ? T[Path]
    : never;

export function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

export function segments<T extends object, K extends MultiKeyFlat<T> & string>(
  path: K,
): [StringKey<T>, ...string[]] {
  return path.split(".") as unknown as [StringKey<T>, ...string[]];
}

export function traverse<T extends object, K extends MultiKeyFlat<T> & string>(
  target: T,
  path: K,
): MultiValue<T, K> {
  let current: unknown = target;

  for (const segment of segments<T, K>(path)) {
    current = (current as Record<string, unknown>)[segment];
  }

  return current as MultiValue<T, K>;
}

export function traverseSet<T extends object, K extends MultiKeyFlat<T> & string>(
  target: T,
  path: K,
  value: MultiValue<T, K>,
  options?: { replace?: boolean; parents?: boolean },
): boolean {
  const replace = options?.replace ?? false;
  const parents = options?.parents ?? false;

  const parts = segments<T, K>(path);
  if (parts.length === 0) return false;

  let current: Record<string, unknown> = target as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = current[key];

    if (isPlainObject(next)) {
      current = next;
      continue;
    }

    if (!parents) {
      return false;
    }

    const created: Record<string, unknown> = {};
    current[key] = created;
    current = created;
  }

  const lastKey = parts[parts.length - 1];

  if (!replace && lastKey in current) {
    return false;
  }

  current[lastKey] = value as unknown;
  return true;
}

export function getKeys<T extends object>(ctor: new () => T) {
  return _getKeys("", new ctor());
}

function _getKeys<T extends object>(prefix = "", source: T) {
  const out: MultiKeyFlat<T>[] = [];
  for (const [key, value] of Object.entries(source)) {
    const fullKey = `${prefix}${key}` as MultiKeyFlat<T>;

    if (isPlainObject(value)) {
      out.push(...(_getKeys(`${fullKey}.`, value) as MultiKeyFlat<T>[]));
    } else {
      out.push(fullKey);
    }
  }

  return out;
}

type MapMultiResult<T extends object, U> = {
  [K in keyof T]: T[K] extends object ? MapMultiResult<T[K], U> : U;
};

function _mapMulti<T extends object, U>(
  prefix: string,
  source: T,
  map: (path: string, value: unknown) => U,
): MapMultiResult<T, U> {
  const result = {} as MapMultiResult<T, U>;

  for (const [key, value] of Object.entries(source) as [keyof T & string, unknown][]) {
    const fullKey = `${prefix}${key}`;

    result[key] = (
      isPlainObject(value) ? _mapMulti(`${fullKey}.`, value, map) : map(fullKey, value)
    ) as MapMultiResult<T, U>[typeof key];
  }

  return result;
}

export function mapMulti<T extends object, U>(
  source: T,
  map: (path: string, value: unknown) => U,
): MapMultiResult<T, U> {
  return _mapMulti("", source, map);
}
