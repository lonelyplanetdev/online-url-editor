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
      templates
        .find((template) => template.id === selectedTemplate)
        ?.fields.filter((field) => !field.inPath)
        .sort((a, b) => {
          if (a.optional && !b.optional) return 1;
          if (!a.optional && b.optional) return -1;
          return 0;
        }) || []
    );
  }, [templates, selectedTemplate]);

  const templatePathParams = React.useMemo(() => {
    return (
      templates
        .find((template) => template.id === selectedTemplate)
        ?.fields.filter((field) => field.inPath)
        .sort((a, b) => {
          if (a.optional && !b.optional) return 1;
          if (!a.optional && b.optional) return -1;
          return 0;
        }) || []
    );
  }, [templates, selectedTemplate]);

  const templateDefaultUrl = React.useMemo(() => {
    return templates.find((template) => template.id === selectedTemplate)?.defaultUrl;
  }, [templates, selectedTemplate]);

  const [templateUrl, setTemplateUrl] = React.useState<string>('');
  const [queryParams, setQueryParams] = React.useState<Record<string, string>>(
    templateQueryParams.reduce((acc, field) => {
      return {
        ...acc,
      };
    }, {}),
  );
  const [pathParams, setPathParams] = React.useState<Record<string, string>>(
    templatePathParams.reduce((acc, field) => {
      return {
        ...acc,
      };
    }, {}),
  );

  const [output, setOutput] = React.useState<string>('');

  const handleTemplateChange = React.useCallback(
    (templateId: string | null) => {
      setTemplateUrl(templates.find((template) => template.id === templateId)?.defaultUrl || '');
      setPathParams({});
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

  const generateQueryParamString = React.useCallback((params: Record<string, string>) => {
    return Object.entries(params)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => {
        const isNumbered = key.toLowerCase().includes('[number]');
        const maxNumber = 10;

        if (isNumbered) {
          // split the value by comma
          const values = value.replaceAll('%2C', ',').split(',').filter(Boolean).slice(0, maxNumber);
          return values
            .map((val, idx) => {
              return `${key.replace(/\[number\]/gi, String(idx + 1))}=${val}`;
            })
            .join('&');
        }
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

    const zippedParams = zipParams(existingParams, queryParams);

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

  const validURL = React.useMemo(() => {
    try {
      if (!templateUrl || !output) return false;
      const urlInstance = new URL(templateUrl);
      return urlInstance.protocol === 'http:' || urlInstance.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }, [templateUrl, output]);

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
      {selectedTemplate && (validURL || templateDefaultUrl) && (
        <>
          {templatePathParams.length > 0 && (
            <div className="grid gap-1.5">
              <Label>Path Parameters</Label>
              <ParameterEditor
                fields={templatePathParams}
                defaultValues={pathParams}
                onChange={setPathParams}
              />
            </div>
          )}
          {templateQueryParams.length > 0 && (
            <div className="grid gap-1.5">
              <Label>Query Parameters</Label>
              <ParameterEditor
                fields={templateQueryParams}
                defaultValues={queryParams}
                onChange={setQueryParams}
              />
            </div>
          )}

          <OutputBox output={output} />
          <Actions output={output} />
        </>
      )}
    </div>
  );
}
