'use client';

import * as React from 'react';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

interface AddDynamicParamProps {
  onAddParam?: (param: string) => void;
}
export function AddDynamicParam({ onAddParam }: AddDynamicParamProps) {
  const [addingParam, setAddingParam] = React.useState<string>('');

  function handleAddParamChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddingParam(e.target.value.replace(/[&%=?]/g, ''));
  }

  function handleAddParamClick() {
    setAddingParam('');
    onAddParam?.(addingParam);
  }

  return (
    <div className="mt-3 flex flex-row items-center gap-x-1">
      <Input
        type="text"
        placeholder="param"
        value={addingParam || ''}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleAddParamClick();
          }
        }}
        onChange={handleAddParamChange}
      />
      <Button
        size="icon"
        variant="outline"
        className="hover:bg-success h-10 w-10"
        onClick={handleAddParamClick}
      >
        <Plus
          size={16}
          className="w-10"
        />
      </Button>
    </div>
  );
}
