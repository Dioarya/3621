import style from "./Brand.module.css";

type BrandProps = {
  logo: string;
  title: string;
  subscript?: string;
};

export default function Brand({ logo, title, subscript }: BrandProps) {
  const text = subscript ? (
    <>
      <div className={style.descriptive}>
        <span className={style.title}>{title}</span>
        <span className={style.subscript}>{subscript}</span>
      </div>
    </>
  ) : (
    <>
      <span className={style.title}>{title}</span>
    </>
  );

  return (
    <div className={style.brand}>
      <img className={style.logo} src={logo} alt={`${title} logo`} />
      {text}
    </div>
  );
}
