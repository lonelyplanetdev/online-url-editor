import { validateRequest } from '~/lib/auth';
import { db } from '~/lib/db';

import { HistoryManager } from './history-manager';
import { Editor } from './editor';

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
      <HistoryManager />
      <Editor templates={templates} />
    </div>
  );
}
