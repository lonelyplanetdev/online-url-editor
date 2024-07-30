import * as React from 'react';

import { Input, InputStyle } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Unlock, Lock, Minus, Plus } from 'lucide-react';
import { cn } from '~/lib/utils';
import { ScrollArea } from '~/components/ui/scroll-area';
import { AddDynamicParam } from './add-param';
import { ListDynamicParams } from './list-params';
import { useEditorStore } from '~/store/editor';

export type DynamicParam = {
  key: string;
  encoded: boolean;
  value: string;
};

interface URLBuilderEditorTemplaterParamsDynamicProps {
  onParamsChanged?: (params: DynamicParam[]) => void;
}
export function URLBuilderEditorTemplaterParamsDynamic({
  onParamsChanged,
}: URLBuilderEditorTemplaterParamsDynamicProps) {
  const editingParams = useEditorStore((state) => state.params);
  const editingUrl = useEditorStore((state) => state.editing?.url);
  const setEditingParams = useEditorStore((state) => state.setParams);

  if (!editingUrl) return null;

  const getParamsFromUrlQuery = (urlQuery: string) => {
    const urlParams = new URLSearchParams(urlQuery);
    const urlParamsKeys = Array.from(urlParams.keys());

    return urlParamsKeys.map((key) => ({
      key,
      value: urlParams.get(key) ?? '',
    }));
  };

  const combineParams = (params: DynamicParam[], urlQuery: string) => {
    const finalParams = [...params];
    const urlParams = getParamsFromUrlQuery(urlQuery);

    finalParams.forEach((param) => {
      const urlParam = urlParams.find((p) => p.key === param.key);

      if (urlParam) {
        param.value = urlParam.value;
      }
    });

    const unincludedUrlParams = urlParams.filter(
      (p) => !finalParams.find((fp) => fp.key === p.key),
    );

    return [
      ...finalParams,
      ...unincludedUrlParams.map((p) => ({
        key: p.key,
        encoded: true,
        value: p.value,
      })),
    ];
  };

  function handleCopy() {
    try {
      const url = new URL(editingUrl);
      const updatedParams = combineParams(editingParams, url.search);

      setEditingParams(updatedParams);
      onParamsChanged?.(updatedParams);
    } catch (error) {
      console.error('Failed to set params from URL:', error);
    }
  }

  return (
    <div className="grid w-full items-center">
      <Label className="mb-1.5 ml-1">Dynamic Params</Label>
      <ListDynamicParams
        onRemoveParam={(param) => {
          const updatedParams = editingParams.filter((p) => p.key !== param);

          setEditingParams(updatedParams);
          onParamsChanged?.(updatedParams);
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
          onParamsChanged?.(updatedParams);
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
          onParamsChanged?.(updatedParams);
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
          onParamsChanged?.(updatedParams);
        }}
      />
      <Button
        size="sm"
        variant="outline"
        className="mt-1 w-full"
        onClick={handleCopy}
      >
        Set from URL
      </Button>
    </div>
  );
}
