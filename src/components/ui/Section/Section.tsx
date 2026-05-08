import Content from "./Content/Content";
import Page from "./Content/Page/Page";
import PageSection from "./Content/Page/Section/Section";
import Button from "./Navbar/Button/Button";
import Navbar from "./Navbar/Navbar";
import Provider from "./Provider/Provider";

export const Section = {
  Navbar: Navbar,
  Button: Button,
  Content: Object.assign(Content, {
    Page: Object.assign(Page, {
      Section: PageSection,
    }),
  }),
  Provider: Provider,
};
