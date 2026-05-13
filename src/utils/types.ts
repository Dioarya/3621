export type Milliseconds = number;
export type EpochMilliseconds = number;
export type Pixels = number;

export type ClassObject<T extends object> = {
  [K in keyof T]: T[K];
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
