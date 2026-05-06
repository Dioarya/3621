import { SectionContentPageProps } from "./Content/Page/Page";

export function toPageInfo({ page }: { page: React.ReactElement<SectionContentPageProps> }) {
  return {
    key: page.props.pageKey,
    label: page.props.pageLabel,
    page: page,
  };
}
