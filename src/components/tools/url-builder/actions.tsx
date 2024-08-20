'use client';

import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';

interface ActionsProps {
  output?: string;
}
export function Actions({ output }: ActionsProps) {
  return (
    <div>
      <div className="grid gap-1.5">
        <Label htmlFor="url_builder_output">Actions</Label>
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            className="px-6"
            onClick={() => {
              console.log('copy to clipboard');
            }}
          >
            Copy Full URL
          </Button>
          <Button
            variant="outline"
            className="px-6"
            onClick={() => {
              console.log('open in new tab');
            }}
          >
            Preview URL
          </Button>
          <Button
            variant="outline"
            className="px-6"
            onClick={() => {
              console.log('open in new tab');
            }}
          >
            Copy Domain Only
          </Button>
        </div>
      </div>
    </div>
  );
}
