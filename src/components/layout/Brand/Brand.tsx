import style from "./Brand.module.css";

type BrandProps = {
  logo: string;
  title: string;
};

export default function Brand({ logo, title }: BrandProps) {
  return (
    <div className={style.brand}>
      <img className={style.logo} src={logo} alt={`${title} logo`} />
      <span className={style.title}>{title}</span>
    </div>
  );
}
