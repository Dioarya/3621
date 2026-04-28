import style from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div className={style.container}>
      <div className={style.spinner}></div>
    </div>
  );
}
