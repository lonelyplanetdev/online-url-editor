import { NWBDAAnalysisTool } from '~/components/tools/nwb-da-analysis';

import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';

export default async function ToolURLBuilderPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Newsbreak {'->'} DomainActive Analysis</PageTitle>
        <PageDescription>
          Upload your Newsbreak and DomainActive data to analyze the overlap between the two.
        </PageDescription>
      </PageHeader>
      <PageContent>
        <NWBDAAnalysisTool />
      </PageContent>
    </>
  );
}
