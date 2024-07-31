'use client';

import * as React from 'react';
import { Shield, Minus, ShieldBan } from 'lucide-react';

import { AddDynamicParam } from './add-param';

import { Label } from '~/components/ui/label';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { InputStyle } from '~/components/ui/input';

import { cn } from '~/lib/utils';

import type { DynamicParam } from '.';
import Link from 'next/link';
import { useUrlBuilderStore } from '~/components/tools/url-builder/store';

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
  const selected = useUrlBuilderStore((state) => state.selected);
  const urls = useUrlBuilderStore((state) => state.urls);

  const selectedUrl = urls.find((url) => url.id === selected);

  const [allParams, setAllParams] = React.useState<DynamicParam[]>([]);

  React.useEffect(() => {
    if (!selectedUrl) return setAllParams([]);

    const isDynamic = selectedUrl.params?.dynamic ? true : false;

    const params = isDynamic ? selectedUrl.params.dynamic! : [];

    setAllParams(params);
  }, [selectedUrl]);

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
      <Label className="mb-1.5 block">Dynamic</Label>

      <div className="h-full max-h-64">
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
              <Label
                className={cn(
                  'min-w-32 max-w-32',
                  InputStyle,
                  'flex h-8 items-center justify-start p-2 font-mono text-xs',
                )}
              >
                {kv.key}
              </Label>
              <Input
                type="text"
                placeholder="value"
                className="h-8 p-2 font-mono text-xs"
                value={allParams.find((p) => p.key === kv.key)?.value}
                onChange={(e) =>
                  handleParamValueChanged(kv.key, e.target.value)
                }
              />
              <Button
                size="icon"
                variant="outline"
                className={cn('h-8 w-8', {
                  'hover:bg-emerald-700': kv.encoded,
                  'hover:bg-destructive': !kv.encoded,
                })}
                onClick={() => handleEncoded(kv.key, !kv.encoded)}
              >
                {!kv.encoded ? (
                  <ShieldBan
                    size={16}
                    className="w-8"
                  />
                ) : (
                  <Shield
                    size={16}
                    className="w-8"
                  />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 hover:bg-destructive"
                onClick={() => handleRemoveParam(kv.key)}
              >
                <Minus
                  size={16}
                  className="w-8"
                />
              </Button>
            </div>
          ))}
        </ScrollArea>
      </div>
      <AddDynamicParam onAddParam={handleAddParam} />
      <ul className="ml-6 mt-2 list-outside list-disc text-xs text-muted-foreground">
        <li>
          You can either just add the param{' '}
          <code className="rounded-sm border">key</code> or add the{' '}
          <code className="rounded-sm border">key=value</code> pair.
        </li>
        <li>
          You can remove the param by clicking the{' '}
          <code className="inline-block aspect-square rounded-sm border">
            <Minus
              size={12}
              className="block w-3"
            />
          </code>{' '}
          button.
        </li>
        <li>
          You can toggle the encoding of the param by clicking the{' '}
          <code className="inline-block aspect-square rounded-sm border">
            <Shield
              size={12}
              className="block w-3"
            />
          </code>{' '}
          button. Encoded params mean that the value will be URL encoded
          <br />
          <code className="rounded-sm border">
            &message=price is $0.99
          </code>{' '}
          will be encoded to{' '}
          <code className="rounded-sm border">
            &message=price%20is%20%240.99
          </code>
          .
        </li>
        <li>
          Some charaters <strong>cannot</strong> be left unencoded as they are
          required as{' '}
          <Link
            href="https://www.rfc-editor.org/rfc/rfc3986"
            className="text-primary underline"
          >
            deliminators
          </Link>
        </li>
      </ul>
    </>
  );
}
