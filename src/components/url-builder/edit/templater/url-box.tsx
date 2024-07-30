'use client';

import * as React from 'react';

import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
import { useEditorStore } from '~/store/editor';

interface URLBuilderEditorTemplaterURLBox {
  onInput?: (value: string, badInput: boolean) => void;
}
export function URLBuilderEditorTemplaterURLBox({
  onInput,
}: URLBuilderEditorTemplaterURLBox) {
  const defaultValue = useEditorStore((state) => state.editing?.url);

  const prevValue = React.useRef<string>(defaultValue || '');
  const [value, setValue] = React.useState<string>(defaultValue || '');

  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );

  function validator(value: string) {
    if (!value) return null;

    try {
      new URL(value);
      return null;
    } catch (e) {
      return 'Invalid URL';
    }
  }

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const error = validator(event.target.value);
    setValidationError(error);

    prevValue.current = event.target.value;
    setValue(prevValue.current);
    onInput?.(event.target.value, !!error);
  }

  React.useEffect(() => {
    setValue(defaultValue || '');
    prevValue.current = defaultValue || '';
  }, [defaultValue]);

  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      <Label
        htmlFor="building_url"
        className={cn('ml-1', validationError && 'text-destructive')}
      >
        URL {validationError ? `- ${validationError}` : ''}
      </Label>
      <Textarea
        placeholder="The URL to build"
        className={cn(
          'h-full grow resize-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-offset-transparent',
          validationError && 'border-destructive',
        )}
        id="building_url"
        value={value}
        onInput={handleInput}
      />
    </div>
  );
}
