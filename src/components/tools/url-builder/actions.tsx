'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';

interface ActionsProps {
  output?: string;
}
export function Actions({ output }: ActionsProps) {
  const [copyFullButtonLabel, setCopyFullButtonLabel] = useState('Copy Full URL');
  const [copyDomainButtonLabel, setCopyDomainButtonLabel] = useState('Copy Domain Only');

  return (
    <div>
      <div className="grid gap-1.5">
        <Label htmlFor="url_builder_output">Actions</Label>
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            className="w-48"
            disabled={!output}
            onClick={() => {
              // copy full url
              navigator.clipboard.writeText(output || '');
              setCopyFullButtonLabel('Copied!');
              setTimeout(() => {
                setCopyFullButtonLabel('Copy Full URL');
              }, 1000);
            }}
          >
            {copyFullButtonLabel}
          </Button>
          <Button
            variant="outline"
            className="w-48"
            disabled={!output}
            asChild={!!output}
          >
            <a
              href={output || ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview URL
            </a>
          </Button>
          <Button
            variant="outline"
            className="w-48"
            onClick={() => {
              // copy domain only
              const url = new URL(output || '');
              navigator.clipboard.writeText(url.hostname.replace(/^www\./, ''));
              setCopyDomainButtonLabel('Copied!');
              setTimeout(() => {
                setCopyDomainButtonLabel('Copy Domain Only');
              }, 1000);
            }}
            disabled={!output}
          >
            {copyDomainButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
