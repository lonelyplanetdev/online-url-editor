'use client';

import * as React from 'react';

import { Input } from '~/components/ui/input';
import { URLBuilderTemplateField, URLBuilderTemplateFieldOption } from '@prisma/client';
import { Textarea } from '~/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '~/components/ui/button';

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
            value={params[field.key]}
            encoded={field.encoded && !ignoreEncoding}
            options={field.selectOptions}
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
  value: string;
  encoded: boolean;
  options?: URLBuilderTemplateFieldOption[];
  onChange: (key: string, value: string, encoded: boolean) => void;
}
function ParameterRow({ param_key: key, type, value, encoded, options, onChange }: ParameterRowProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex gap-2">
      <Input
        readOnly
        defaultValue={key}
        className="h-full w-48"
      />
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
              .replace(/^,/, '');

            onChange(key, parsed, encoded);
          }}
        />
      ) : type === 'SELECT' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              {selected || value || 'Select an option'}
              <ChevronsUpDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-96"
            align="start"
          >
            {options?.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="flex justify-between"
                onClick={() => {
                  setSelected(option.value);
                  onChange(key, option.value, encoded);
                }}
              >
                <span>{option.value}</span>
                {value === option.value && <Check className="size-4" />}
              </DropdownMenuItem>
            ))}
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
}
