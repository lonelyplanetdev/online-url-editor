import { redirect } from 'next/navigation';
import { validateRequest } from '~/lib/auth';
import { db } from '~/lib/db';
import { URLBuilderTool } from '~/components/tools/url-builder';
import { URLBuilderTemplate, URLBuilderTemplateField, URLBuilderTemplateFieldOption } from '@prisma/client';
import { PageContent, PageDescription, PageHeader, PageTitle } from '~/components/page-details';

export default async function ToolURLBuilderPage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  const userUrlBuilderTemplates = (await db.uRLBuilderTemplate
    .findMany({
      orderBy: [{ name: 'asc' }],
      include: {
        fields: {
          orderBy: [{ type: 'asc' }, { key: 'asc' }],
          include: { selectOptions: { orderBy: [{ value: 'asc' }] } },
        },
      },
    })
    .catch(() => [])) as (URLBuilderTemplate & {
    fields: (URLBuilderTemplateField & { selectOptions: URLBuilderTemplateFieldOption[] })[];
  })[];

  return (
    <>
      <PageHeader>
        <PageTitle>URL Builder</PageTitle>
        <PageDescription>Build and edit URLs on the fly.</PageDescription>
      </PageHeader>
      <PageContent container>
        <URLBuilderTool templates={userUrlBuilderTemplates} />
      </PageContent>
    </>
  );
}
