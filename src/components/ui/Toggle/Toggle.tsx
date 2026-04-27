import styles from "./Toggle.module.css";

type ToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
};

export default function Toggle({ checked, onChange, className }: ToggleProps) {
  return (
    <input
      className={`${styles.toggle} ${className ?? ""}`}
      role="switch"
      type="checkbox"
      checked={checked}
      aria-checked={checked}
      onChange={onChange ? () => onChange(!checked) : undefined}
      readOnly={!onChange}
    ></input>
  );
}
