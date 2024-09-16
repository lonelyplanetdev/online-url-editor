'use client';

import { useEffect, useRef, useState } from 'react';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';

interface ExclusionsProps {
  onExclusionsChange?: (exclusions: string[]) => void;
}
export function Exclusions({ onExclusionsChange }: ExclusionsProps) {
  const exclusionsList = useRef<string[]>([]);
  const [textareaValue, setTextareaValue] = useState<string>('');

  useEffect(() => {
    exclusionsList.current = textareaValue
      .split('\n')
      .map((exclusion) => exclusion.trim())
      .filter(Boolean);
    onExclusionsChange?.(exclusionsList.current);
  }, [textareaValue]);

  return (
    <div>
      <div className="grid gap-1.5">
        <Label htmlFor="url_builder_output">Exclusions</Label>
        <p className="text-xs text-muted-foreground">
          Exclusions are a list of campaign names that will be used to filter out rows from the report data.
        </p>
        <Textarea
          className="h-40 resize-none"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
        />
      </div>
    </div>
  );
}
