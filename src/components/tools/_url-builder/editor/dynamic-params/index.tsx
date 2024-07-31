import * as React from 'react';

import { Label } from '~/components/ui/label';
import { ListDynamicParams } from './list-params';
import { Separator } from '~/components/ui/separator';
import { useUrlBuilderStore } from '~/components/tools/url-builder/store';
import {
  buildUrlFromParts,
  getUrlParams,
} from '~/components/tools/url-builder/util';

export type DynamicParam = {
  key: string;
  encoded: boolean;
  value: string;
};

export function DynamicParamsEditor() {
  const selected = useUrlBuilderStore((state) => state.selected);
  const urls = useUrlBuilderStore((state) => state.urls);
  const upsertUrl = useUrlBuilderStore((state) => state.upsertUrl);

  const selectedUrl = urls.find((url) => url.id === selected);

  const [editingParams, setEditingParams] = React.useState<DynamicParam[]>([]);

  React.useEffect(() => {
    if (!selectedUrl) return setEditingParams([]);

    const isDynamic = selectedUrl.params?.dynamic ? true : false;

    const params = isDynamic ? selectedUrl.params.dynamic! : [];

    setEditingParams(params);
  }, [selectedUrl]);

  function handleParamsChanged(params: DynamicParam[]) {
    if (!selectedUrl || !selected) return;

    const isDynamic = selectedUrl
      ? selectedUrl.params.dynamic
        ? true
        : false
      : false;

    const finishedUrl = buildUrlFromParts({
      urlInstance: new URL(selectedUrl.base),
      params: editingParams,
    });

    upsertUrl(selected, {
      base: finishedUrl,
      params: {
        dynamic: params,
      },
    });

    console.log(params);
  }

  return (
    <div className="grid w-full items-center">
      <Label className="text-md font-semibold">Parameters</Label>
      <Separator className="my-1.5" />
      <ListDynamicParams
        onRemoveParam={(param) => {
          const updatedParams = editingParams.filter((p) => p.key !== param);

          setEditingParams(updatedParams);
          handleParamsChanged(updatedParams);
        }}
        onAddParam={(param) => {
          const updatedParams = [
            ...editingParams,
            {
              key: param,
              encoded: true,
              value: '',
            },
          ];

          setEditingParams(updatedParams);
          handleParamsChanged(updatedParams);
        }}
        onParamValueChanged={(param, value) => {
          const updatedParams = editingParams.map((p) => {
            if (p.key === param) {
              return {
                ...p,
                value,
              };
            }

            return p;
          });

          setEditingParams(updatedParams);
          handleParamsChanged(updatedParams);
        }}
        onParamEncodingChanged={(param, encoded) => {
          const updatedParams = editingParams.map((p) => {
            if (p.key === param) {
              return {
                ...p,
                encoded,
              };
            }

            return p;
          });

          setEditingParams(updatedParams);
          handleParamsChanged(updatedParams);
        }}
      />
    </div>
  );
}
