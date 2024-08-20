'use client';

import { useState, useEffect } from 'react';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';

interface OutputProps {
  output?: string;
}
export function OutputBox({ output }: OutputProps) {
  const [value, setValue] = useState(output || '');

  useEffect(() => {
    setValue(output || '');
  }, [output]);

  return (
    <div>
      <div className="grid gap-1.5">
        <Label htmlFor="url_builder_output">Output</Label>
        <div className="relative">
          <Textarea
            readOnly
            className="resize-none"
            id="url_builder_output"
            value={value}
          />
        </div>
      </div>
    </div>
  );
}
