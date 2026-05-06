import { createContext, useContext } from "react";

type SegmentedControlContextType<T = any> = {
  value: T;
  onChange: (value: T) => void;
};

export const segmentedControlContext = createContext<SegmentedControlContextType | null>(null);

export function useSegmentedControlContext() {
  const ctx = useContext(segmentedControlContext);
  if (ctx === null) {
    throw new Error("Must be used inside SegmentedControl");
  }
  return ctx;
}
