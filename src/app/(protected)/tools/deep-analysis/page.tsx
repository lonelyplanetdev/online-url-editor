import { DeepAnalysisTool } from '~/components/tools/deep-analysis';

import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';
import { validateRequest } from '~/lib/auth';
import { redirect } from 'next/navigation';

export default async function DeepAnalysisPage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  return (
    <>
      <PageHeader>
        <PageTitle>Deep Analysis</PageTitle>
        <PageDescription>Upload your deep reports to analyze the overlap between the all of them.</PageDescription>
      </PageHeader>
      <PageContent>
        <DeepAnalysisTool />
      </PageContent>
    </>
  );
}
