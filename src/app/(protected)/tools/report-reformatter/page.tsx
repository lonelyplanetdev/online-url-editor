import { ReportReformatterTool } from '~/components/tools/report-reformatter';

import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '~/components/page-details';

export default async function ToolURLBuilderPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Report Reformatter</PageTitle>
        <PageDescription>
          Upload your meta and newsbreak reports to reformat them for upload to
          DOTS.
        </PageDescription>
      </PageHeader>
      <PageContent container>
        <ReportReformatterTool />
      </PageContent>
    </>
  );
}
