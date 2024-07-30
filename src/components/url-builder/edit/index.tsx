'use client';

import * as React from 'react';

import { Card, CardHeader, CardFooter } from '~/components/ui/card';
import { URLBuilderEditorTemplater as Templater } from './templater';
import { IncludeWWW } from './include-www';
import { CopyButtons } from './copy-buttons';

interface URLBuilderEditorProps {
  templates:
    | {
        id: string;
        name: string;
      }[]
    | null;
}

export function URLBuilderEditor({ templates }: URLBuilderEditorProps) {
  return (
    <Card className="col-span-1 flex h-full min-h-0 min-w-0 flex-col bg-primary-foreground">
      <CardHeader className="border-b p-3">
        <h2 className="text-md font-bold uppercase">Editor</h2>
      </CardHeader>
      <div className="flex-grow p-3">
        <Templater templates={templates} />
      </div>
      <CardFooter className="flex w-full items-center justify-between border-t p-3">
        <IncludeWWW />
        <CopyButtons />
      </CardFooter>
    </Card>
  );
}
