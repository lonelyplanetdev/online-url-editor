import { NWBDAAnalysisTool } from '~/components/tools/nwb-da-analysis';

import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';
import { validateRequest } from '~/lib/auth';
import { redirect } from 'next/navigation';

export default async function NWBDAAnalysisPage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

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
