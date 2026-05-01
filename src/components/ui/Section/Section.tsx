import Content from "./Content/Content";
import Page from "./Content/Page/Page";
import Navbar from "./Navbar/Navbar";
import NavButton from "./NavButton/NavButton";
import Provider from "./Provider/Provider";

export const Section = {
  Navbar: Navbar,
  NavButton: NavButton,
  Content: Object.assign(Content, {
    Page: Page,
  }),
  Provider: Provider,
};
