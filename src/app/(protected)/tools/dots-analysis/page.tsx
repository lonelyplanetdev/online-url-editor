import { DOTSAnalysisTool } from '~/components/tools/dots-analysis';

import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';
import { validateRequest } from '~/lib/auth';
import { redirect } from 'next/navigation';

export default async function ToolURLBuilderPage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

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
