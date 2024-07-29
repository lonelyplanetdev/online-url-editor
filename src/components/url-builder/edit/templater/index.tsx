'use client';

import * as React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { URLBuilderEditorTemplaterSelectTemplate as SelectTemplate } from './select-template';
import { URLBuilderEditorTemplaterURLBox as URLBox } from './url-box';
import { URLBuilderEditorTemplaterParamsDynamic as ParamsDynamic } from './params/dynamic';
import { useURLStore } from '~/store/urls';

interface URLBuilderEditorTemplaterProps {
  url: {
    id: string;
    url: string;
    unencodedParams: string[];
    template?: string;
  } | null;
  templates:
    | {
        id: string;
        name: string;
      }[]
    | null;
}
export function URLBuilderEditorTemplater({
  url,
  templates,
}: URLBuilderEditorTemplaterProps) {
  const updateUrl = useURLStore((state) => state.updateUrl);
  const setSelected = useURLStore((state) => state.setSelected);

  const [allTemplates, setAllTemplates] = React.useState<
    | {
        id: string;
        name: string;
      }[]
    | null
  >(templates);
  const template = React.useRef<string | null>(null);

  const [urlValue, setUrlValue] = React.useState<{
    id: string;
    url: string;
    unencodedParams: string[];
    template?: string;
  } | null>(null);

  const editingUrl = React.useRef<{
    id: string;
    url: string;
    unencodedParams: string[];
    template?: string;
  } | null>(null);

  function handleInput(value: string, badInput: boolean) {
    console.log('domain manually ipdated');

    if (!value) {
      setSelected('');

      return;
    }

    if (badInput) return;

    editingUrl.current = {
      id: editingUrl.current?.id || '',
      url: value,
      unencodedParams: editingUrl.current?.unencodedParams || [],
      template: editingUrl.current?.template || template.current || '',
    };

    updateUrl(
      editingUrl.current.id,
      editingUrl.current.url,
      editingUrl.current.unencodedParams,
      editingUrl.current.template,
    );
  }

  React.useEffect(() => {
    if (templates) {
      setAllTemplates(templates);
    }
  }, [templates]);

  React.useEffect(() => {
    if (url) {
      editingUrl.current = url;
    } else {
      editingUrl.current = null;
    }

    setUrlValue(editingUrl.current);
  }, [url]);

  function handleParamsChange(
    params: { param: string; encoded: boolean; value: string }[],
  ) {
    if (!editingUrl.current) return;

    const formattedParams = params
      .map((param) => {
        if (!param.value.trim()) return null;
        return param.encoded
          ? `${param.param}=${encodeURIComponent(param.value)}`
          : `${param.param}=${param.value}`;
      })
      .filter((param) => param !== null);

    const theFinishUrl = new URL(editingUrl.current.url);
    theFinishUrl.search = '';

    const theFinishUrlString =
      theFinishUrl.toString() + '?' + formattedParams.join('&');

    const unencodedParams = params
      .filter((param) => !param.encoded)
      .map((param) => param.param);

    editingUrl.current.url = theFinishUrlString;

    updateUrl(
      editingUrl.current.id,
      editingUrl.current.url,
      unencodedParams,
      editingUrl.current.template
        ? editingUrl.current.template
        : template.current || '',
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-3 lg:flex-row">
      <div className="space-y-6 lg:basis-1/2">
        {templates !== null && (
          <SelectTemplate
            templates={allTemplates}
            onTemplateChange={(id) => {
              template.current = id;
            }}
            url={urlValue}
          />
        )}
        <ParamsDynamic
          onParamChanged={handleParamsChange}
          url={url || null}
        />
      </div>
      <div className="lg:basis-1/2">
        <URLBox
          onInput={handleInput}
          validator={(value) => {
            if (!value) return null;

            try {
              new URL(value);
              return null;
            } catch (e) {
              return 'Invalid URL';
            }
          }}
          defaultValue={urlValue?.url}
        />
      </div>
    </div>
  );
}
