import clsx from "clsx";
import { useRef, useState } from "react";

import Minus from "@/assets/Math/minus.svg?react";
import Plus from "@/assets/Math/plus.svg?react";

import style from "./Slider.module.css";

type SliderProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

const Slider = ({ value, onChange, className, min = 0, max = 100, step = 1 }: SliderProps) => {
  const trackRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<number | null>(null);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const displayValue = dragValue ?? value;
  const pct = ((displayValue - min) / (max - min)) * 100;

  const snapFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const raw = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const scaled = min + raw * (max - min);
    return Math.max(min, Math.min(max, Math.round(scaled / step) * step));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const snapped = snapFromClientX(e.clientX);
    if (snapped === null) return;
    dragRef.current = snapped;
    setDragValue(snapped);

    const handleMove = (e: MouseEvent) => {
      e.preventDefault();
      const snapped = snapFromClientX(e.clientX);
      if (snapped === null) return;
      dragRef.current = snapped;
      setDragValue(snapped);
    };
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      if (dragRef.current !== null) onChange(dragRef.current);
      dragRef.current = null;
      setDragValue(null);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        onChange(Math.min(max, value + step));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        onChange(Math.max(min, value - step));
        break;
      case "Home":
        e.preventDefault();
        onChange(min);
        break;
      case "End":
        e.preventDefault();
        onChange(max);
        break;
    }
  };

  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <span className={clsx(style.container, className)}>
      <button type="button" onClick={decrement} className={style.btn} aria-label="Decrease">
        <Minus />
      </button>
      <span
        className={style["track-wrap"]}
        ref={trackRef}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuenow={displayValue}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <span className={style.track} />
        <span className={style.knob} style={{ left: `${pct}%` }}>
          {Math.round(displayValue)}
        </span>
      </span>
      <button type="button" onClick={increment} className={style.btn} aria-label="Increase">
        <Plus />
      </button>
    </span>
  );
};

export default Slider;
