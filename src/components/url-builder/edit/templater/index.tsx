'use client';

import * as React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { URLBuilderEditorTemplaterSelectTemplate as SelectTemplate } from './select-template';
import { URLBuilderEditorTemplaterURLBox as URLBox } from './url-box';
import { URLBuilderEditorTemplaterParamsDynamic as ParamsDynamic } from './params/dynamic';
import { useURLStore } from '~/store/urls';
import { useEditorStore } from '~/store/editor';

interface URLBuilderEditorTemplaterProps {
  templates:
    | {
        id: string;
        name: string;
      }[]
    | null;
}
export function URLBuilderEditorTemplater({
  templates,
}: URLBuilderEditorTemplaterProps) {
  const editingId = useEditorStore((state) => state.editing?.id);
  const editingUrl = useEditorStore((state) => state.editing?.url);
  const editingParams = useEditorStore((state) => state.params);
  const allUrls = useURLStore((state) => state.urls);

  const setEditingParams = useEditorStore((state) => state.setParams);
  const setEditingUrl = useEditorStore((state) => state.setUrl);
  const setEditingId = useEditorStore((state) => state.setId);
  const updateUrl = useURLStore((state) => state.updateUrl);
  const setSelected = useURLStore((state) => state.setSelected);
  const setBlank = useEditorStore((state) => state.setBlank);

  const isCreating = !!editingId;

  const parseParamValue = (value: string, encoded: boolean) => {
    if (encoded) return encodeURIComponent(value);
    return decodeURIComponent(value);
  };

  function handleParamChange(
    params: {
      key: string;
      encoded: boolean;
      value: string;
    }[],
  ) {
    if (isCreating) return null;

    setEditingParams(
      params.map((param) => ({
        ...param,
        value: param.value.replace(/[&%=?]/g, ''),
        key: param.key.replace(/[&%=?]/g, ''),
      })),
    );

    const currentUrl = editingUrl;

    const urlUri = currentUrl.split('?')[0];

    // check if there are any params in the url
    const urlParams: string[] = [];

    params.forEach((param) => {
      urlParams.push(
        `${param.key.replace(/[&%=?]/g, '')}=${parseParamValue(param.value.replace(/[&%=?]/g, ''), param.encoded)}`,
      );
    });

    const newUrl = `${urlUri}?${urlParams.join('&')}`;

    updateUrl(
      editingId,
      newUrl,
      params.filter((param) => !param.encoded).map((param) => param.key),
    );
    setEditingUrl(newUrl);
  }

  function handleUrlChange(url: string) {
    var currentId = '';

    if (isCreating) {
      currentId = uuidv4();
      setEditingId(currentId);
      setEditingUrl(url);
      updateUrl(currentId, url, []);
      setSelected(currentId);
    } else currentId = editingId;

    setEditingUrl(url);

    const urlParamsSection = url.split('?')[1];

    const urlParams = new URLSearchParams(urlParamsSection);

    const currentParams = editingParams;
    const currentUnecondedParams = currentParams.filter(
      (param) => !param.encoded,
    );

    const newParams = currentParams.map((param) => {
      const value = urlParams.get(param.key);

      return {
        ...param,
        encoded: !currentUnecondedParams.includes(param),
        value: value || '',
      };
    });

    const updatedParams = [
      ...newParams.map((param) => ({
        ...param,
        value: param.value.replace(/[&%=?]/g, ''),
        key: param.key.replace(/[&%=?]/g, ''),
      })),
    ];

    updateUrl(
      currentId,
      url,
      updatedParams.filter((param) => !param.encoded).map((param) => param.key),
    );
    setEditingParams(updatedParams);
  }

  return (
    <div className="flex h-full w-full flex-col gap-3 lg:flex-row">
      <div className="space-y-6 lg:basis-1/2">
        {/* {templates !== null && (
          <SelectTemplate
            templates={allTemplates}
            onTemplateChange={(id) => {
              template.current = id;
            }}
            url={urlValue}
          />
        )} */}
        <ParamsDynamic onParamsChanged={handleParamChange} />
        {isCreating ? 'Editing' : 'Creating'} URL
      </div>
      <div className="lg:basis-1/2">
        <URLBox
          onInput={(value, badInput) => {
            if (!value) {
              setBlank();
              return;
            }

            if (badInput) return;

            handleUrlChange(value);
          }}
        />
      </div>
    </div>
  );
}
