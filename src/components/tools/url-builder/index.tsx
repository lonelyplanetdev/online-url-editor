'use client';

import * as React from 'react';
import type { URLBuilderTemplate, URLBuilderTemplateField } from './util';

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
  const [fields, setFields] = React.useState<URLBuilderTemplateField[]>([]);

  const [url, setUrl] = React.useState<string | null>(null);
  const [params, setParams] = React.useState<string[]>([]);
  const [output, setOutput] = React.useState<string>('');

  function handleManualURLChange(url: string) {
    console.log('handleManualURLChange', url);
    setUrl(url);

    if (url !== '') setOutput(generateUrl(url, params));
  }

  function handleTemplateChange(templateId: string | null) {
    console.log('handleTemplateChange', templateId);
    setSelectedTemplate(templateId);

    const exisitngParams = getExisitngParams(url || '');
    let templateFields =
      templates.find((t) => t.id === templateId)?.fields || [];

    templateFields = templateFields.map((field) => {
      if (!field.hidden && exisitngParams[field.key])
        field.defaultValue = exisitngParams[field.key];

      return field;
    });

    setFields(templateFields);
    setParams([]);

    setOutput(generateUrl(url || '', []));
  }

  const handleParametersChange = React.useCallback(
    (params: string[]) => {
      console.log('handleParametersChange', params);

      setParams(params);
      setOutput(generateUrl(url || '', params));
    },
    [url],
  );

  function getExisitngParams(url: string): Record<string, string> {
    try {
      const urlInstance = new URL(url);
      const searchParams = new URLSearchParams(urlInstance.search);
      const existingParams: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        existingParams[key] = value;
      });

      console.log('getExisitngParams', existingParams);

      return existingParams;
    } catch (error) {
      return {};
    }
  }

  function generateUrl(url: string, params: string[]) {
    try {
      const urlInstance = new URL(url);
      const paramKeys = params.map((param) => param.split('=')[0]);

      const searchParams = new URLSearchParams(urlInstance.search);

      searchParams.forEach((_, key) => {
        if (paramKeys.includes(key)) searchParams.delete(key);
      });

      urlInstance.search = searchParams.toString();

      const prefix = searchParams.toString() ? '&' : '?';
      const outputHref = urlInstance.href;
      const final =
        outputHref + (params.length ? `${prefix}${params.join('&')}` : '');
      return final;
    } catch (error) {
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
            fields={fields}
            onChange={handleParametersChange}
          />
        </div>
      )}

      <OutputBox output={output} />
      <Actions output={output} />
    </div>
  );
}
