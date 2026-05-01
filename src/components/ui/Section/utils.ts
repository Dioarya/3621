import { SectionContentPageProps } from "./Content/Page/Page";
import { PageInfo } from "./types";

export function toPageInfo({
  page,
}: {
  page: React.ReactElement<SectionContentPageProps>;
}): PageInfo {
  return {
    key: page.props.pageKey,
    label: page.props.pageLabel,
    page: page,
  };
}
