export type PageInfo = {
  page: React.ReactElement;
  key: string;
  label: string;
};

export type UseStateSetter<T, K extends keyof T> = React.Dispatch<
  React.SetStateAction<Exclude<T[K], undefined>>
>;

export type SectionContextType = {
  pages: PageInfo[];
  setPages: UseStateSetter<SectionContextType, "pages">;
  selected: string | null;
  setSelected: UseStateSetter<SectionContextType, "selected">;
  navbarShown: boolean;
  setNavbarShown: UseStateSetter<SectionContextType, "navbarShown">;
  scroll: {
    scrollLeft: () => void;
    scrollRight: () => void;
  };
};
