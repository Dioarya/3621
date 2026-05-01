import Content from "./Content/Content";
import Page from "./Content/Page/Page";
import Button from "./Navbar/Button/Button";
import Navbar from "./Navbar/Navbar";
import Provider from "./Provider/Provider";

export const Section = {
  Navbar: Navbar,
  Button: Button,
  Content: Object.assign(Content, {
    Page: Page,
  }),
  Provider: Provider,
};
