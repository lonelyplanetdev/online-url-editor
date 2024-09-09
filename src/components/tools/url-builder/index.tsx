'use client';

import * as React from 'react';
import type { URLBuilderTemplate, URLBuilderTemplateField, URLBuilderTemplateFieldOption } from '@prisma/client';

import { Label } from '~/components/ui/label';
import { Actions } from './actions';
import { TemplateSelect } from './template-select';
import { OutputBox } from './output-box';
import { URLBox } from './url-box';
import ParameterEditor from './parameter-editor';

interface URLBuilderToolProps {
  templates: (URLBuilderTemplate & {
    fields: (URLBuilderTemplateField & { selectOptions: URLBuilderTemplateFieldOption[] })[];
  })[];
}
export function URLBuilderTool({ templates }: URLBuilderToolProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>();
  const templateQueryParams = React.useMemo(() => {
    return (
      templates.find((template) => template.id === selectedTemplate)?.fields.filter((field) => !field.inPath) || []
    );
  }, [templates, selectedTemplate]);

  const templatePathParams = React.useMemo(() => {
    return templates.find((template) => template.id === selectedTemplate)?.fields.filter((field) => field.inPath) || [];
  }, [templates, selectedTemplate]);

  const templateDefaultUrl = React.useMemo(() => {
    return templates.find((template) => template.id === selectedTemplate)?.defaultUrl;
  }, [templates, selectedTemplate]);

  const [templateUrl, setTemplateUrl] = React.useState<string>('');
  const [pathParams, setPathParams] = React.useState<Record<string, string>>(
    templatePathParams.reduce((acc, field) => {
      return {
        ...acc,
        [field.key]: field.selectOptions.length && field.type === 'SELECT' ? field.selectOptions[0].value : '',
      };
    }, {}),
  );
  const [queryParams, setQueryParams] = React.useState<Record<string, string>>(
    templateQueryParams.reduce((acc, field) => {
      return {
        ...acc,
        [field.key]: field.selectOptions.length && field.type === 'SELECT' ? field.selectOptions[0].value : '',
      };
    }, {}),
  );
  const [output, setOutput] = React.useState<string>('');

  const handleTemplateChange = React.useCallback(
    (templateId: string | null) => {
      setTemplateUrl(templates.find((template) => template.id === templateId)?.defaultUrl || '');
      setPathParams({});
      setQueryParams({});
      setOutput('');
      setSelectedTemplate(templateId);
    },
    [templates],
  );

  const handleValidUrlChange = React.useCallback(
    (url: string) => {
      setTemplateUrl(url);
    },
    [setTemplateUrl],
  );

  const handleQueryParamChange = React.useCallback(
    (params: Record<string, string>) => {
      setQueryParams(params);
    },
    [setQueryParams],
  );

  const handlePathParamChange = React.useCallback(
    (params: Record<string, string>) => {
      setPathParams(params);
    },
    [setPathParams],
  );

  const generateQueryParamString = React.useCallback((params: Record<string, string>) => {
    return Object.entries(params)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join('&');
  }, []);

  const getTemplateUrlExisitingParams = React.useCallback(() => {
    const url = (() => {
      try {
        return new URL(templateUrl);
      } catch (error) {
        return null;
      }
    })();

    if (!url) return {};

    const searchParams = new URLSearchParams(url.search);
    const params: Record<string, string> = Object.fromEntries(searchParams.entries());

    return params;
  }, [templateUrl]);

  function zipParams(lowPriority: Record<string, string>, highPriority: Record<string, string>) {
    const zippedParams = { ...lowPriority };

    for (const key of Object.keys(highPriority)) {
      zippedParams[key] = highPriority[key];
    }

    return zippedParams;
  }

  // useEffect to update output when pathParams or queryParams change
  React.useEffect(() => {
    if (!selectedTemplate) return;

    const replacedUrl = templateUrl.replace(/\[(.*?)\]/g, (match, key) => {
      if (pathParams[key]) return pathParams[key];
      return match;
    });

    const url = (() => {
      try {
        return new URL(replacedUrl);
      } catch (error) {
        return null;
      }
    })();

    if (!url) return;

    const existingParams = getTemplateUrlExisitingParams();
    const zippedParams = zipParams(queryParams, existingParams);

    const searchParams = generateQueryParamString(zippedParams);

    // remove existing query params
    url.search = '';

    setOutput(`${url.href}${searchParams ? `?${searchParams}` : ''}`);
  }, [
    generateQueryParamString,
    getTemplateUrlExisitingParams,
    pathParams,
    queryParams,
    selectedTemplate,
    templatePathParams,
    templateQueryParams,
    templateUrl,
  ]);

  return (
    <div className="grid gap-8">
      <TemplateSelect
        templates={templates}
        onTemplateChange={handleTemplateChange}
      />
      {selectedTemplate && !templateDefaultUrl && (
        <URLBox
          url={templateUrl}
          onValidChange={handleValidUrlChange}
          onEmpty={() => setOutput('')}
        />
      )}
      {selectedTemplate && (
        <>
          <div className="grid gap-1.5">
            <Label>Path Parameters</Label>
            <ParameterEditor
              fields={templatePathParams}
              defaultValues={pathParams}
              onChange={handlePathParamChange}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Query Parameters</Label>
            <ParameterEditor
              fields={templateQueryParams}
              defaultValues={queryParams}
              onChange={handleQueryParamChange}
            />
          </div>
          <OutputBox output={output} />
          <Actions output={output} />
        </>
      )}
    </div>
  );
}
