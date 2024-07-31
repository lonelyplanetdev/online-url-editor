'use client';

import * as React from 'react';

import { Card, CardHeader, CardFooter } from '~/components/ui/card';
import { CopyButtons } from './copy-buttons';
import { UrlBox } from './url-box';
import { v4 as uuidv4 } from 'uuid';

import { useUrlBuilderStore } from '~/components/tools/url-builder/store';
import { DynamicParamsEditor } from './dynamic-params';
import { UrlDetails } from './url-details';
import { getUrlParams } from '../util';

interface EditorProps {
  templates:
    | {
        id: string;
        name: string;
      }[]
    | null;
}

export function Editor({ templates }: EditorProps) {
  const setSelected = useUrlBuilderStore((state) => state.setSelected);
  const upsertUrl = useUrlBuilderStore((state) => state.upsertUrl);
  const urls = useUrlBuilderStore((state) => state.urls);
  const selected = useUrlBuilderStore((state) => state.selected);

  const selectedUrl = urls.find((url) => url.id === selected);

  function handleUrlInput(value: string) {
    if (value) {
      var id: string | null = selected;

      if (!id) id = uuidv4();
      const isDynamic = selectedUrl
        ? selectedUrl.params.dynamic
          ? true
          : false
        : false;
      const currentTemplate = selectedUrl
        ? selectedUrl.params.template
        : undefined;
      const currentUnencodedParams = (
        selectedUrl
          ? isDynamic
            ? selectedUrl.params.dynamic
            : selectedUrl.params.fieldValues
          : []
      )!
        .filter((param) => param.encoded === false)
        .map((param) => param.key);

      const searchParams = getUrlParams(value, currentUnencodedParams);

      const urlDataParams = isDynamic
        ? { dynamic: searchParams }
        : { template: currentTemplate, fieldValues: searchParams };

      upsertUrl(id, {
        base: value,
        params: urlDataParams,
      });

      setSelected(id);
    } else setSelected(null);
  }

  return (
    <Card className="col-span-1 flex h-full min-h-0 min-w-0 flex-col bg-primary-foreground">
      <CardHeader className="border-b p-3">
        <h2 className="text-md font-bold uppercase">URL Editor</h2>
      </CardHeader>
      <div className="flex flex-grow flex-col gap-3 p-3">
        <UrlBox onInput={handleUrlInput} />
        {selected ? (
          <div className="flex w-full grow flex-col gap-3 lg:flex-row">
            <div className="grow lg:basis-1/2">
              <UrlDetails />
            </div>
            <div className="grow lg:basis-1/2">
              <DynamicParamsEditor />
            </div>
          </div>
        ) : (
          <div className="w-full text-center text-sm text-gray-500">
            To edit the URL, please input a URL
          </div>
        )}
      </div>
      <CardFooter className="border-t p-3">
        <CopyButtons />
      </CardFooter>
    </Card>
  );
}
