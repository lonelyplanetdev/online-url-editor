'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '~/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';

interface MultiSelectProps {
  items: string[] | Record<string, string>; // Can be string[] or Record<string, string>
  defaultSelected?: string[]; // Optional default selected values
  onChange?: (selected: string[]) => void; // Optional onChange callback that returns string[] of selected values
  maxSelect?: number; // 📌 Added maxSelect prop to specify the maximum number of selectable items
  disabled?: boolean; // 📌 Added disabled prop to disable the MultiSelect component
}

export function MultiSelect({
  items,
  defaultSelected = [],
  onChange,
  maxSelect,
  disabled = false, // 📌 Destructured disabled from props with a default value of false
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>(defaultSelected);

  // Determine if the items prop is string[] or Record<string, string>
  const isItemsArray = Array.isArray(items);
  const itemLabels = isItemsArray
    ? Object.fromEntries((items as string[]).map((item) => [item, item])) // If string[], map values to labels
    : (items as Record<string, string>); // If Record<string, string>, use directly

  const handleUnselect = (value: string) => {
    if (disabled) return; // 📌 Prevent unselecting if disabled
    const newSelected = selected.filter((item) => item !== value);
    setSelected(newSelected);
    onChange?.(newSelected); // Call onChange callback with the new selected values
  };

  const handleSelect = (value: string) => {
    if (disabled) return; // 📌 Prevent unselecting if disabled
    if (maxSelect && selected.length >= maxSelect) return; // 📌 Check if maxSelect is defined and if the limit is reached
    const newSelected = [...selected, value];
    setSelected(newSelected);
    setInputValue('');
    onChange?.(newSelected); // Call onChange callback with the new selected values
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return; // 📌 Prevent any key interactions if disabled
    const input = inputRef.current;
    if (input) {
      if ((e.key === 'Delete' || e.key === 'Backspace') && input.value === '') {
        handleUnselect(selected[selected.length - 1]);
      }
      if (e.key === 'Escape') {
        input.blur();
      }
    }
  };

  const selectables = Object.keys(itemLabels).filter((item) => !selected.includes(item));

  const isMaxSelected = maxSelect ? selected.length >= maxSelect : false; // 📌 Check if maxSelect is reached

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${disabled ? 'cursor-not-allowed opacity-50' : ''}`} // 📌 Apply styles when disabled
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
            >
              {itemLabels[item]}
              <button
                className={`ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 ${disabled ? 'cursor-not-allowed' : ''}`} // 📌 Apply styles when disabled
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUnselect(item);
                  }
                }}
                onMouseDown={(e) => {
                  if (disabled) return; // 📌 Prevent unselecting if disabled
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => {
                  if (disabled) return; // 📌 Prevent unselecting if disabled
                  handleUnselect(item);
                }}
                disabled={disabled} // 📌 Disable the button when the component is disabled
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => {
              if (!isMaxSelected && !disabled) {
                // 📌 Only open the dropdown if maxSelect is not reached and not disabled
                setOpen(true);
              }
            }}
            placeholder={isMaxSelected ? `Maximum of ${maxSelect} selected` : 'Select items...'} // 📌 Update placeholder based on maxSelect
            className={`ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${
              isMaxSelected || disabled ? 'cursor-not-allowed' : ''
            }`} // 📌 Add cursor style when maxSelect is reached or disabled
            disabled={isMaxSelected || disabled} // 📌 Disable input when maxSelect is reached or if disabled
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 && !isMaxSelected && !disabled ? ( // 📌 Only show the dropdown if maxSelect is not reached and not disabled
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((item) => (
                  <CommandItem
                    key={item}
                    onMouseDown={(e) => {
                      if (disabled) return; // 📌 Prevent selecting if disabled

                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => handleSelect(item)}
                    className={`cursor-pointer ${disabled ? 'pointer-events-none' : ''}`} // 📌 Apply styles when disabled
                  >
                    {itemLabels[item]}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
