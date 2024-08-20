'use client';

import * as React from 'react';

import { Input } from '~/components/ui/input';
import { URLBuilderTemplateField } from './util';

interface ParametersListProps {
  fields: URLBuilderTemplateField[];
  onChange?: (parameters: string[]) => void;
}
function ParametersList({ fields, onChange }: ParametersListProps) {
  const params = React.useRef<{ [key: string]: string }>({});

  React.useEffect(() => {
    fields
      .filter((field) => !!field.defaultValue)
      .forEach((field) => {
        const param = field.encoded
          ? `${field.key}=${encodeURIComponent(field.defaultValue)}`
          : `${field.key}=${field.defaultValue}`;

        params.current[field.key] = param;
      });
  }, [fields]);

  return (
    <div className="grid gap-2">
      {fields
        .filter((field) => !field.hidden)
        .map((field) => (
          <ParamaterRow
            key={field.key}
            type={field.type}
            param_key={field.key}
            value={field.defaultValue}
            encoded={field.encoded}
            onChange={(key, value, encoded) => {
              // parse the values to out eg. key={{value}} if not encoded (also replace the charaters that are required to be encoded like ;?:@&=,/)
              // or key=%7B%7Bvalue%7D%7D if encoded

              if (value === '') {
                delete params.current[key];
                onChange?.(Object.values(params.current));
                return;
              }

              let param;
              // param:
              // parse the values to out eg. key={{value}} if not encoded (also replace the charaters that are required to be encoded like ;?:@&=,/)
              // or key=%7B%7Bvalue%7D%7D if encoded

              param = encoded
                ? `${key}=${encodeURIComponent(value)}`
                : `${key}=${value}`;

              params.current[key] = param;

              onChange?.(Object.values(params.current));
            }}
          />
        ))}
    </div>
  );
}

interface ParamaterRowProps {
  param_key: string;
  type: string;
  value: string;
  encoded: boolean;
  onChange: (key: string, value: string, encoded: boolean) => void;
}
function ParamaterRow({
  param_key: key,
  type,
  value,
  encoded,
  onChange,
}: ParamaterRowProps) {
  return (
    <div className="flex gap-2">
      <Input
        readOnly
        defaultValue={key}
        className="w-48"
      />
      <Input
        defaultValue={value}
        className="grow"
        onChange={(e) => onChange(key, e.target.value, encoded)}
      />
      {type}
    </div>
  );
}

export { ParametersList };
