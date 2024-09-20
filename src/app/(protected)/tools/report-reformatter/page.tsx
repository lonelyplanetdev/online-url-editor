import { ReportReformatterTool } from '~/components/tools/report-reformatter';

import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';
import { validateRequest } from '~/lib/auth';
import { redirect } from 'next/navigation';

export default async function ToolURLBuilderPage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  return (
    <>
      <PageHeader>
        <PageTitle>Report Reformatter</PageTitle>
        <PageDescription>Upload your meta and newsbreak reports to reformat them for upload to DOTS.</PageDescription>
      </PageHeader>
      <PageContent container>
        <ReportReformatterTool />
      </PageContent>
    </>
  );
}
