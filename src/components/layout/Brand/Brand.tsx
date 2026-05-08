import React from "react";

import style from "./Brand.module.css";

type BrandLogoProps = { src: string; alt: string };
type BrandTextProps = { children: string };
type BrandSubscriptProps = { children: string };

type BrandChild =
  | React.ReactElement<BrandLogoProps>
  | React.ReactElement<BrandTextProps>
  | React.ReactElement<BrandSubscriptProps>;

type BrandProps = {
  children: BrandChild | BrandChild[];
};

const Logo = ({ src, alt }: BrandLogoProps) => {
  return <img className={style.logo} src={src} alt={alt} />;
};

const Text = ({ children }: BrandTextProps) => {
  return <span className={style.title}>{children}</span>;
};

const Subscript = ({ children }: BrandSubscriptProps) => {
  return <span className={style.subscript}>{children}</span>;
};

const Brand = ({ children }: BrandProps) => {
  const childArray = React.Children.toArray(children) as React.ReactElement[];

  const logo = childArray.find((c) => c.type === Logo);
  const text = childArray.find((c) => c.type === Text);
  const subscript = childArray.find((c) => c.type === Subscript);

  return (
    <div className={style.brand}>
      {logo}
      {(text || subscript) && (
        <div className={style.descriptive}>
          {text}
          {subscript}
        </div>
      )}
    </div>
  );
};

Brand.Logo = Logo;
Brand.Text = Text;
Brand.Subscript = Subscript;

export default Brand;
