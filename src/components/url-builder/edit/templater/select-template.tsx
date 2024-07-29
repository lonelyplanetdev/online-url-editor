'use client';

import * as React from 'react';

import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { InputStyle } from '~/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useURLStore } from '~/store/urls';

interface URLBuilderEditorTemplaterSelectTemplateProps {
  templates:
    | {
        id: string;
        name: string;
      }[]
    | null;
  url: {
    id: string;
    url: string;
    template?: string;
  } | null;
  onTemplateChange?: (id: string) => void;
}
export function URLBuilderEditorTemplaterSelectTemplate({
  templates,
  url,
  onTemplateChange,
}: URLBuilderEditorTemplaterSelectTemplateProps) {
  const { selected, updateUrl } = useURLStore();

  const selectedUrl = React.useRef<{
    id: string;
    url: string;
    template?: string;
  } | null>(null);

  const prevSelectedTemplate = React.useRef<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(
    null,
  );

  function selectTemplate(id: string, url?: { id: string; url: string }) {
    if (url) {
      updateUrl(url.id, url.url, [], id);
    }
    prevSelectedTemplate.current = id;
    setSelectedTemplate(id);
  }

  const templateName = (id: string) => {
    const template = templates?.find((t) => t.id === id);
    return template ? template.name : 'No Template';
  };

  React.useEffect(() => {
    selectedUrl.current = url;
    setSelectedTemplate(url?.template || null);
  }, [url]);

  React.useEffect(() => {
    if (onTemplateChange) {
      onTemplateChange(selectedTemplate || '');
    }
  }, [selectedTemplate]);

  React.useEffect(() => {}, [selected]);

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label
        htmlFor="template"
        className="ml-1"
      >
        Template
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className={InputStyle}>
            {selectedTemplate ? templateName(selectedTemplate) : 'No Template'}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-96"
          align="start"
        >
          <DropdownMenuCheckboxItem
            checked={!selectedTemplate}
            onCheckedChange={(checked) => {
              if (checked) selectTemplate('', selectedUrl.current || undefined);
            }}
          >
            No Template
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {templates?.map((template) => (
            <DropdownMenuCheckboxItem
              key={template.id}
              checked={selectedTemplate === template.id}
              onCheckedChange={(checked) => {
                if (checked)
                  selectTemplate(template.id, selectedUrl.current || undefined);
              }}
            >
              {template.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
