'use client';

import * as React from 'react';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

type Checked = DropdownMenuCheckboxItemProps['checked'];

interface ColumnMultiselectProps {
  columns: string[];
  onColumnsSelect: (columns: string[]) => void;
}
export function ColumnMultiselect({ columns, onColumnsSelect }: ColumnMultiselectProps) {
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([]);

  const handleColumnChange = (column: string, checked: Checked) => {
    if (checked) setSelectedColumns((prev) => [...prev, column]);
    else setSelectedColumns((prev) => prev.filter((m) => m !== column));
  };

  React.useEffect(() => {
    onColumnsSelect(selectedColumns.length === 0 ? [] : selectedColumns);
  }, [selectedColumns]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full grow basis-1/4 justify-start text-left font-normal"
        >
          {selectedColumns.length === 0
            ? 'All Columns'
            : selectedColumns.length <= 3
              ? selectedColumns.join(', ')
              : `${selectedColumns.slice(0, 3).join(', ')} +${selectedColumns.length - 3} More`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="start"
      >
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            onClick={(e) => {
              e.preventDefault();
              handleColumnChange(column, !selectedColumns.includes(column));
            }}
            checked={selectedColumns.includes(column)}
          >
            {column}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
