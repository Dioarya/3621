export type PlainObject = Record<string, unknown>;

export type MultiKey<T extends object, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends PlainObject
    ? MultiKey<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type MultiValue<
  T extends object,
  Path extends MultiKey<T>,
> = Path extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? T[Head] extends PlainObject
      ? MultiValue<T[Head], Extract<Rest, MultiKey<T[Head]>>>
      : never
    : never
  : Path extends keyof T
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

export function traverse<T extends object, K extends MultiKey<T> & string>(
  target: T,
  path: K,
): MultiValue<T, K> {
  let current: unknown = target;

  for (const segment of path.split(".")) {
    current = (current as Record<string, unknown>)[segment];
  }

  return current as MultiValue<T, K>;
}

function _getKeys<T extends PlainObject>(prefix = "", source: T): MultiKey<T>[] {
  const out: MultiKey<T>[] = [];
  for (const [key, value] of Object.entries(source)) {
    const fullKey = `${prefix}${key}`;

    if (isPlainObject(value)) {
      out.push(...(_getKeys(`${fullKey}.`, value) as MultiKey<T>[]));
    } else {
      out.push(fullKey as MultiKey<T>);
    }
  }

  return out;
}

export function getKeys<T extends object>(ctor: new () => T) {
  return _getKeys("", new ctor() as PlainObject);
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
