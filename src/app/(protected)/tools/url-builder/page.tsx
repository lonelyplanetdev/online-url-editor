import { redirect } from 'next/navigation';
import { validateRequest } from '~/lib/auth';
import { db } from '~/lib/db';
import { URLBuilderTool } from '~/components/tools/url-builder';
import { URLBuilderTemplate } from '~/components/tools/url-builder/util';
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '~/components/page-details';

export default async function ToolURLBuilderPage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  const userUrlBuilderTemplates = (await db.uRLBuilderTemplate
    .findMany({
      select: {
        id: true,
        name: true,
        fields: {
          select: {
            key: true,
            type: true,
            defaultValue: true,
            required: true,
            hidden: true,
            encoded: true,
          },
        },
      },
    })
    .catch(() => [])) as URLBuilderTemplate[];

  return (
    <main>
      <PageHeader>
        <PageTitle>URL Builder</PageTitle>
        <PageDescription>Build and edit URLs on the fly.</PageDescription>
      </PageHeader>
      <PageContent container>
        <URLBuilderTool templates={userUrlBuilderTemplates} />
      </PageContent>
    </main>
  );
}
