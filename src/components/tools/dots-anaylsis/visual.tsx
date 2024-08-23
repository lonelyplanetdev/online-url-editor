'use client';

import * as React from 'react';
import type { ReportDataRow } from '.';
import { Label } from '~/components/ui/label';

interface VisualProps {
  data: ReportDataRow[];
}
function Visual({ data }: VisualProps) {
  return (
    <div className="grid gap-1.5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
      <Label>Visual</Label>
    </div>
  );
}

export { Visual };
