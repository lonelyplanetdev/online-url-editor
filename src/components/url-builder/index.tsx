import { URLBuilderHistory } from './history';
import { URLBuilderEditor } from './edit';
import { validateRequest } from '~/lib/auth';
import { db } from '~/lib/db';

export async function URLBuilder() {
  const { user } = await validateRequest();
  var templates: any[] | null = [];

  if (user) {
    try {
      templates = await db.template.findMany({
        where: {
          userId: user.id,
        },
        include: {
          fields: true,
        },
      });
    } catch (error) {}
  }

  if (!user) templates = null;

  return (
    <div className="container grid w-screen grow grid-cols-[256px_auto] gap-4">
      <URLBuilderHistory />
      <URLBuilderEditor templates={templates} />
    </div>
  );
}
