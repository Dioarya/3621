import styles from "./Toggle.module.css";

type ToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <input
      className={styles.toggle}
      role="switch"
      type="checkbox"
      checked={checked}
      aria-checked={checked}
      onChange={onChange ? () => onChange(!checked) : undefined}
      readOnly={!onChange}
    ></input>
  );
}
