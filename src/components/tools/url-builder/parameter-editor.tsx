'use client';

import * as React from 'react';
import Link from 'next/link';

import { Input } from '~/components/ui/input';
import { URLBuilderTemplateField, URLBuilderTemplateFieldOption } from '@prisma/client';
import { Textarea } from '~/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { ArrowUpRight, Asterisk, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import { Popover, PopoverTrigger } from '~/components/ui/popover';

interface ParametersListProps {
  ignoreEncoding?: boolean;
  fields: (URLBuilderTemplateField & { selectOptions: URLBuilderTemplateFieldOption[] })[];
  defaultValues: Record<string, string>;
  onChange?: (parameters: Record<string, string>) => void;
}
export default function ParameterEditor({ ignoreEncoding, fields, defaultValues, onChange }: ParametersListProps) {
  const fieldsToParams: Record<string, string> = React.useMemo(() => {
    return fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.key]: field.defaultValue || '',
      };
    }, {});
  }, [fields]);

  const [params, setParams] = React.useState<Record<string, string>>(() => {
    return Object.keys(fieldsToParams).reduce((acc, key) => {
      return {
        ...acc,
        [key]: defaultValues[key] || fieldsToParams[key],
      };
    }, {});
  });

  React.useEffect(() => {
    setParams((prev) => {
      return Object.keys(fieldsToParams).reduce((acc, key) => {
        return {
          ...acc,
          [key]: prev[key] || fieldsToParams[key],
        };
      }, {});
    });
  }, [fieldsToParams]);

  React.useEffect(() => {
    onChange?.(params);
  }, [params, onChange]);

  return (
    <div className="grid gap-2">
      {fields
        .filter((field) => !field.hidden)
        .map((field) => (
          <ParameterRow
            key={field.key}
            type={field.type}
            param_key={field.key}
            optional={field.optional}
            value={params[field.key]}
            encoded={field.encoded && !ignoreEncoding}
            options={field.selectOptions}
            infoLink={field.infoLink}
            onChange={(key, value, encoded) => {
              setParams((prev) => {
                return {
                  ...prev,
                  [key]: encoded ? encodeURIComponent(value) : value,
                };
              });
            }}
          />
        ))}
    </div>
  );
}

interface ParameterRowProps {
  param_key: string;
  type: string;
  optional: boolean;
  value: string;
  encoded: boolean;
  infoLink: string | null;
  options?: URLBuilderTemplateFieldOption[];
  onChange: (key: string, value: string, encoded: boolean) => void;
}
function ParameterRow({
  param_key: key,
  type,
  optional,
  value,
  encoded,
  infoLink,
  options,
  onChange,
}: ParameterRowProps) {
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  return (
    <div className="flex gap-2">
      <div
        className={cn(
          'text-bold relative flex h-full w-32 items-center rounded-md border px-3 text-sm',
          !optional ? 'bg-destructive/25' : 'bg-primary-foreground',
        )}
      >
        {infoLink ? (
          <Link
            href={infoLink}
            className="relative pr-3.5 underline-offset-4 hover:underline"
            target="_blank"
          >
            {key}{' '}
            <ArrowUpRight
              className="absolute right-0 top-0"
              size={14}
            />
          </Link>
        ) : (
          key
        )}
        {!optional && (
          <div
            className="absolute right-0 ml-1 text-destructive"
            title="Manadatory Field"
          >
            <Asterisk size={20} />
          </div>
        )}
      </div>

      {type === 'LIST' ? (
        <Textarea
          defaultValue={value}
          className="grow"
          placeholder="comma or newline separated list"
          onChange={(e) => {
            const parsed = e.target.value
              .replace(/\n/g, ',')
              .replace(/,{2,}/g, ',')
              .replace(/,$/, '')
              .replace(/^,/, '')
              .replace(/^"/, '')
              .replace(/"$/, '');

            onChange(key, parsed, encoded);
          }}
        />
      ) : type === 'SELECT' ? (
        <DropdownMenu modal={true}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              {getLabel(options || [], selected || value) || 'Select an option'}
              <ChevronsUpDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-96"
            align="start"
          >
            <ScrollArea className={cn(options && options.length > 6 && 'h-48')}>
              {options?.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className="flex justify-between"
                  onClick={() => {
                    setSelected(option.value);
                    onChange(key, option.value, encoded);
                  }}
                >
                  <span>{option.label || option.value}</span>
                  {value === option.value && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : type === 'MULTI_SELECT' ? (
        <DropdownMenu modal={true}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              {selected && selected.split(',').length > 0
                ? `${selected?.split(',').length} options selected`
                : 'Select an option'}
              <ChevronsUpDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-96"
            align="start"
          >
            <ScrollArea className={cn(options && options.length > 6 && 'h-48')}>
              {options?.map((option) => {
                const checked = selected?.split(',').includes(option.value);
                return (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      setSelected((prev) => {
                        const newSelected = isChecked
                          ? prev
                            ? `${prev},${option.value}`
                            : option.value
                          : prev
                              ?.split(',')
                              .filter((v) => v !== option.value)
                              .join(',');

                        // Call onChange with the updated value
                        onChange(key, newSelected || '', encoded);

                        return newSelected;
                      });
                    }}
                  >
                    {option.label || option.value}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Input
          defaultValue={value}
          className="grow"
          onChange={(e) => onChange(key, e.target.value, encoded)}
        />
      )}
    </div>
  );
  function getLabel(options: URLBuilderTemplateFieldOption[], value: string) {
    const foundOption = options?.find((option) => option.value === value) || null;
    return foundOption?.label || value;
  }
}
