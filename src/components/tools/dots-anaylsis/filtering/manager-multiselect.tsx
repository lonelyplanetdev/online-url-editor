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

interface ManagerMultiselectProps {
  managers: string[];
  onManagersSelect: (managers: string[]) => void;
}
export function ManagerMultiselect({ managers, onManagersSelect }: ManagerMultiselectProps) {
  const [selectedManagers, setSelectedManagers] = React.useState<string[]>([]);

  const handleManagerChange = (manager: string, checked: Checked) => {
    if (checked) setSelectedManagers((prev) => [...prev, manager]);
    else setSelectedManagers((prev) => prev.filter((m) => m !== manager));
  };

  React.useEffect(() => {
    onManagersSelect(selectedManagers.length === 0 ? [] : selectedManagers);
  }, [selectedManagers]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full grow basis-1/4 justify-start text-left font-normal"
        >
          {selectedManagers.length === 0
            ? 'All Managers'
            : selectedManagers.length <= 3
              ? selectedManagers.join(', ')
              : `${selectedManagers.slice(0, 3).join(', ')} +${selectedManagers.length - 3} More`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="start"
      >
        <DropdownMenuLabel>Managers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {managers.map((manager) => (
          <DropdownMenuCheckboxItem
            onClick={(e) => {
              e.preventDefault();
              handleManagerChange(manager, !selectedManagers.includes(manager));
            }}
            checked={selectedManagers.includes(manager)}
          >
            {manager}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
