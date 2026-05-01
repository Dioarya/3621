import React from "react";

import style from "./Brand.module.css";

// Type branding
const BRAND_LOGO = Symbol("Brand.Logo");
const BRAND_TEXT = Symbol("Brand.Text");
const BRAND_SUBSCRIPT = Symbol("Brand.Subscript");

type BrandLogoProps = { src: string; alt: string; _type?: typeof BRAND_LOGO };
type BrandTextProps = { children: string; _type?: typeof BRAND_TEXT };
type BrandSubscriptProps = { children: string; _type?: typeof BRAND_SUBSCRIPT };

type BrandChild =
  | React.ReactElement<BrandLogoProps>
  | React.ReactElement<BrandTextProps>
  | React.ReactElement<BrandSubscriptProps>;

type BrandProps = {
  children: BrandChild | BrandChild[];
};

function Logo({ src, alt }: BrandLogoProps) {
  return <img className={style.logo} src={src} alt={alt} />;
}

function Text({ children }: BrandTextProps) {
  return <span className={style.title}>{children}</span>;
}

function Subscript({ children }: BrandSubscriptProps) {
  return <span className={style.subscript}>{children}</span>;
}

Logo._type = BRAND_LOGO;
Text._type = BRAND_TEXT;
Subscript._type = BRAND_SUBSCRIPT;

export default function Brand({ children }: BrandProps) {
  const childArray = React.Children.toArray(children) as React.ReactElement[];

  const logo = childArray.find((c) => (c.type as any)._type === BRAND_LOGO);
  const text = childArray.find((c) => (c.type as any)._type === BRAND_TEXT);
  const subscript = childArray.find((c) => (c.type as any)._type === BRAND_SUBSCRIPT);

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
}

Brand.Logo = Logo;
Brand.Text = Text;
Brand.Subscript = Subscript;
