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
