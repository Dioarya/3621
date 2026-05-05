/* Exhaustive String Tuple implementation taken from jcalz on StackOverflow
 *
 * https://stackoverflow.com/a/55266531
 */

type AtLeastOne<T> = [T, ...T[]];

export const exhaustiveStringTuple =
  <T extends string>() =>
  <L extends AtLeastOne<T>>(
    ...x: L extends any
      ? Exclude<T, L[number]> extends never
        ? L
        : Exclude<T, L[number]>[]
      : never
  ) =>
    x;

export type ClassObject<T extends object> = {
  [K in keyof T]: T[K];
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
