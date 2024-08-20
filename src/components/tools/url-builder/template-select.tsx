'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';

interface URLBuilderTemplate {
  id: string;
  name: string;
}
function TemplateSelect({
  templates,
  onTemplateChange,
}: {
  templates: URLBuilderTemplate[];
  onTemplateChange?: (templateId: string | null) => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    string | null
  >();

  function handleTemplateChange(templateId: string | null) {
    console.log('handleTemplateChange', templateId);
    setSelectedTemplate(templateId);
    onTemplateChange?.(templateId);
  }

  return (
    <div className="grid gap-1.5">
      <Label>Template</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-96 justify-between"
          >
            {selectedTemplate
              ? templates.find((t) => t.id === selectedTemplate)?.name
              : 'Select a template'}
            <ChevronsUpDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-96"
          align="start"
        >
          {templates.map((template) => (
            <DropdownMenuItem
              key={template.id}
              className="flex justify-between"
              onClick={() =>
                handleTemplateChange(
                  selectedTemplate !== template.id ? template.id : null,
                )
              }
            >
              <span>{template.name}</span>
              {selectedTemplate === template.id && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { TemplateSelect };
