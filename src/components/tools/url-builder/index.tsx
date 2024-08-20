'use client';

import * as React from 'react';
import { URLBuilderTemplate } from './util';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { URLBox } from './url-box';
import { TemplateSelect } from './template-select';
import { ParametersList } from './paramaters-list';
import { OutputBox } from './output-box';
import { Actions } from './actions';

interface URLBuilderToolProps {
  templates: URLBuilderTemplate[];
}
export function URLBuilderTool({ templates }: URLBuilderToolProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    string | null
  >();
  const [url, setUrl] = React.useState<string | null>(null);
  const [params, setParams] = React.useState<string[]>([]);
  const [output, setOutput] = React.useState<string>('');

  function handleManualURLChange(url: string) {
    console.log('handleManualURLChange', url);
    setUrl(url);
    setOutput(parseInputs(url, params));
  }

  React.useEffect(() => {
    setOutput(parseInputs(url || '', params));
  }, [params]);

  function handleTemplateChange(templateId: string | null) {
    console.log('handleTemplateChange', templateId);
    setSelectedTemplate(templateId);
    setParams([]);
    setOutput('');
  }

  function handleParametersChange(params: string[]) {
    console.log('handleParametersChange', params);

    setParams(params);
  }

  function parseInputs(url: string, params: string[]) {
    try {
      const urlInstance = new URL(url);
      const paramKeys = params.map((param) => param.split('=')[0]);

      const searchParams = new URLSearchParams(urlInstance.search);

      searchParams.forEach((_, key) => {
        if (paramKeys.includes(key)) return;
        searchParams.delete(key);
      });

      // prefix is ? if no search params are present, otherwise it's &
      const prefix = searchParams.toString() ? '&' : '?';

      const outputHref = urlInstance.href;

      const final =
        outputHref + (params.length ? `${prefix}${params.join('&')}` : '');
      console.log('final', final);
      return final;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  return (
    <div className="grid gap-8">
      <URLBox
        url={url || ''}
        onValidChange={handleManualURLChange}
      />
      <TemplateSelect
        templates={templates}
        onTemplateChange={handleTemplateChange}
      />

      {selectedTemplate && (
        <div className="grid gap-1.5">
          <Label>Parameters</Label>
          <ParametersList
            fields={
              templates.find((t) => t.id === selectedTemplate)?.fields || []
            }
            onChange={handleParametersChange}
          />
        </div>
      )}

      <OutputBox output={output} />
      <Actions output={output} />
    </div>
  );
}
