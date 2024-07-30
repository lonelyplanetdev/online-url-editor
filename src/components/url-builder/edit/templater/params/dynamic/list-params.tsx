'use client';

import * as React from 'react';
import { Unlock, Minus, Lock } from 'lucide-react';

import { AddDynamicParam } from './add-param';

import { Label } from '~/components/ui/label';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { InputStyle } from '~/components/ui/input';

import { cn } from '~/lib/utils';

import type { DynamicParam } from '.';
import { useEditorStore } from '~/store/editor';

interface ListDynamicParamsProps {
  onRemoveParam?: (param: string) => void;
  onAddParam?: (param: string) => void;
  onParamEncodingChanged?: (param: string, encoded: boolean) => void;
  onParamValueChanged?: (param: string, value: string) => void;
}
export function ListDynamicParams({
  onRemoveParam,
  onAddParam,
  onParamEncodingChanged,
  onParamValueChanged,
}: ListDynamicParamsProps) {
  const editingParams = useEditorStore((state) => state.params);
  const editingUrl = useEditorStore((state) => state.editing?.url);

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

  const [allParams, setAllParams] = React.useState<DynamicParam[]>([]);

  React.useEffect(() => {
    console.log('editingUrl:', editingUrl);
    try {
      const url = new URL(editingUrl);
      const updatedParams = combineParams(editingParams, url.search);

      setAllParams(updatedParams);
    } catch (error) {
      console.error('Failed to set params from URL:', error);
    }
  }, [editingUrl]);

  React.useEffect(() => {
    setAllParams(editingParams);
  }, [editingParams]);

  React.useEffect(() => {
    console.log('setAllParams:', allParams);
  }, [allParams]);

  if (!editingUrl) return null;

  function handleAddParam(key: string) {
    if (allParams.find((p) => p.key === key)) return;

    setAllParams((prev) => {
      return [
        ...prev,
        {
          key,
          encoded: true,
          value: '',
        },
      ];
    });

    onAddParam?.(key);
  }

  function handleEncoded(key: string, encoded: boolean) {
    if (!allParams.find((p) => p.key === key)) return;

    setAllParams((prev) => {
      return prev.map((p) => {
        if (p.key === key) {
          return {
            ...p,
            encoded,
          };
        }
        return p;
      });
    });

    onParamEncodingChanged?.(key, encoded);
  }

  function handleRemoveParam(key: string) {
    if (!allParams.find((p) => p.key === key)) return;

    setAllParams((prev) => {
      return prev.filter((p) => p.key !== key);
    });

    onRemoveParam?.(key);
  }

  function handleParamValueChanged(key: string, value: string) {
    if (!allParams.find((p) => p.key === key)) return;

    setAllParams((prev) => {
      return prev.map((p) => {
        if (p.key === key) {
          return {
            ...p,
            value,
          };
        }
        return p;
      });
    });

    onParamValueChanged?.(key, value);
  }

  return (
    <>
      <div className="h-full max-h-96">
        <ScrollArea className="h-full rounded-lg border bg-background/50 px-2 pb-1 pt-1">
          {!allParams.length && (
            <div className="text-center text-sm text-gray-500">
              No params supplied
            </div>
          )}
          {allParams.map((kv) => (
            <div
              key={kv.key}
              className="my-1 flex flex-row items-center gap-x-1"
            >
              <Label className={cn('min-w-32 max-w-32', InputStyle)}>
                {kv.key}
              </Label>
              <Input
                type="text"
                placeholder="value"
                value={allParams.find((p) => p.key === kv.key)?.value}
                onChange={(e) =>
                  handleParamValueChanged(kv.key, e.target.value)
                }
              />
              <Button
                size="icon"
                variant="outline"
                className={cn('h-10 w-10', {
                  'hover:bg-emerald-700': kv.encoded,
                  'hover:bg-destructive': !kv.encoded,
                })}
                onClick={() => handleEncoded(kv.key, !kv.encoded)}
              >
                {!kv.encoded ? (
                  <Unlock
                    size={16}
                    className="w-10"
                  />
                ) : (
                  <Lock
                    size={16}
                    className="w-10"
                  />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10 hover:bg-destructive"
                onClick={() => handleRemoveParam(kv.key)}
              >
                <Minus
                  size={16}
                  className="w-10"
                />
              </Button>
            </div>
          ))}
        </ScrollArea>
      </div>
      <AddDynamicParam onAddParam={handleAddParam} />
    </>
  );
}
