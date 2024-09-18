import { DOTSAnalysisTool } from '~/components/tools/dots-analysis';

import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';

export default async function ToolURLBuilderPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>DOTS Analysis</PageTitle>
        <PageDescription>Upload your DOTS daily performance report to visually analyze the data.</PageDescription>
      </PageHeader>
      <PageContent>
        <DOTSAnalysisTool />
      </PageContent>
    </>
  );
}
