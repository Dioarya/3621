import style from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={style.container}>
      <div className={style.spinner}></div>
    </div>
  );
};

export default Spinner;
