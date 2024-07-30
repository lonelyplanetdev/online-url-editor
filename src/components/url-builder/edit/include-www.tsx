'use client';

import * as React from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { useEditorStore } from '~/store/editor';

export function IncludeWWW() {
  const setIncludeWWW = useEditorStore((state) => state.setIncludeWWW);
  const includeWWW = useEditorStore((state) => state.includeWWW);

  const isChecked = React.useRef(false);

  React.useEffect(() => {
    isChecked.current = includeWWW;
  }, [includeWWW]);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="include_www"
        defaultChecked={isChecked.current}
        onCheckedChange={(checked) => {
          isChecked.current = !!checked;
          setIncludeWWW(!!checked);
        }}
      />
      <label
        htmlFor="include_www"
        className="cursor-pointer select-none text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Include <code>www.</code> in Hostname
      </label>
    </div>
  );
}
