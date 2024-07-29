'use client';

import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardFooter } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { useURLStore } from '~/store/urls';
import { URLBuilderEditorTemplater as Templater } from './templater';

interface URLBuilderEditorProps {
  templates:
    | {
        id: string;
        name: string;
      }[]
    | null;
}

export function URLBuilderEditor({ templates }: URLBuilderEditorProps) {
  const { selected, urls } = useURLStore();
  const includeWWW = React.useRef<0 | 1>(1);

  const prevSelectedUrl = React.useRef<{
    id: string;
    url: string;
    unencodedParams: string[];
    template?: string;
  } | null>(null);
  const [selectedUrl, setSelectedUrl] = React.useState<{
    id: string;
    url: string;
    unencodedParams: string[];
    template?: string;
  } | null>(null);

  function copyHostname() {
    if (!prevSelectedUrl.current) return;
    var hostname = new URL(prevSelectedUrl.current.url).hostname;
    hostname = !includeWWW.current
      ? hostname.replace(new RegExp(/^www\./i), '')
      : hostname;

    navigator.clipboard.writeText(hostname);
  }

  function copyFullURL() {
    if (!prevSelectedUrl.current) return;
    navigator.clipboard.writeText(prevSelectedUrl.current.url);
  }

  React.useEffect(() => {
    prevSelectedUrl.current = urls.find((url) => url.id === selected) || null;

    setSelectedUrl(prevSelectedUrl.current);
  }, [urls, selected]);

  return (
    <Card className="col-span-1 flex h-full min-h-0 min-w-0 flex-col bg-primary-foreground">
      <CardHeader className="border-b p-3">
        <h2 className="text-md font-bold uppercase">Editor</h2>
      </CardHeader>
      <div className="flex-grow p-3">
        <Templater
          url={selectedUrl}
          templates={templates}
        />
      </div>
      <CardFooter className="flex w-full items-center justify-between border-t p-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include_www"
            defaultChecked={!!includeWWW.current}
            onCheckedChange={(checked) => {
              includeWWW.current = checked ? 1 : 0;
            }}
          />
          <label
            htmlFor="include_www"
            className="cursor-pointer select-none text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include www. in Hostname
          </label>
        </div>
        <div className="flex flex-row-reverse justify-start gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={copyFullURL}
          >
            Copy Full URL
          </Button>
          <Button
            variant="secondary"
            onClick={copyHostname}
            size="sm"
          >
            Copy Hostname
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
