import * as React from 'react';

import { Input, InputStyle } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Unlock, Lock, Minus, Plus } from 'lucide-react';
import { cn } from '~/lib/utils';
import { ScrollArea } from '~/components/ui/scroll-area';

type DynamicParam = {
  param: string;
  encoded: boolean;
  value: string;
};
interface URLBuilderEditorTemplaterParamsDynamicProps {
  onParamChanged: (params: DynamicParam[]) => void;
  url: {
    id: string;
    url: string;
    unencodedParams: string[];
  } | null;
}
export function URLBuilderEditorTemplaterParamsDynamic({
  onParamChanged,
  url,
}: URLBuilderEditorTemplaterParamsDynamicProps) {
  const prevUrl = React.useRef<{
    id: string;
    url: string;
    unencodedParams: string[];
  } | null>(url);

  const prevAllParams = React.useRef<DynamicParam[]>([]);
  const [allParams, setAllParams] = React.useState<DynamicParam[]>([]);
  const [toAddParam, setToAddParam] = React.useState<string | null>(null);

  function removeParam(param: string) {
    setAllParams((prev) => {
      const newParams = prev.filter((p) => p.param !== param);

      return newParams;
    });
  }

  function setEncoded(param: string, encoded: boolean) {
    const newParams = prevAllParams.current.map((p) => {
      if (p.param === param) {
        return {
          param: p.param,
          encoded,
          value: p.value,
        };
      }

      return p;
    });

    setAllParams(newParams);
  }

  function addParam(param: string, value: string) {
    const exisitingParam = allParams.find((p) => p.param === param);

    if (exisitingParam) return;

    setAllParams((prev) => {
      const newParams = [...prev, { param, encoded: true, value }];

      return newParams;
    });
  }

  function requestImport() {
    prevUrl.current = url;

    if (!url) return;

    const gotInUrlParams = getCurrentParams(url.url, url.unencodedParams);

    setAllParams(gotInUrlParams);
  }

  const getCurrentParams = (url: string, unencodedParams: string[]) => {
    const urlParams: {
      param: string;
      encoded: boolean;
      value: string;
    }[] = [];

    try {
      const urlObj = new URL(url);
      const searchParams = urlObj.searchParams;

      searchParams.forEach((value, key) => {
        urlParams.push({
          param: key,
          encoded: !unencodedParams.includes(key),
          value,
        });
      });
    } finally {
      return urlParams;
    }
  };

  React.useEffect(() => {
    console.log('URL changed', url);
  }, [prevUrl.current]);

  React.useEffect(() => {
    prevAllParams.current = allParams;

    onParamChanged(allParams);
  }, [allParams]);

  React.useEffect(() => {
    if (!prevUrl.current || (url && url.id !== prevUrl.current.id)) {
      if (!url) return;
      setAllParams(getCurrentParams(url.url, url.unencodedParams));
      prevUrl.current = url;
    }
  }, [url]);

  return (
    <div className="grid w-full items-center">
      <Label className="mb-1.5 ml-1">Dynamic Params</Label>
      <div className="h-full max-h-96">
        <ScrollArea className="h-full border-y p-3">
          {!allParams.length && (
            <div className="text-center text-sm text-gray-500">
              No params supplied
            </div>
          )}
          {allParams.map((kv) => (
            <div
              key={kv.param}
              className="mb-1 flex flex-row items-center gap-x-1"
            >
              <Label className={cn('min-w-32 max-w-32', InputStyle)}>
                {kv.param}
              </Label>
              <Input
                type="text"
                placeholder="value"
                value={allParams.find((p) => p.param === kv.param)?.value}
                onChange={(e) => {
                  setAllParams((prev) => {
                    const newParams = prev.map((p) => {
                      if (p.param === kv.param) {
                        return {
                          param: kv.param,
                          encoded: kv.encoded,
                          value: e.target.value,
                        };
                      }
                      return p;
                    });

                    return newParams;
                  });
                }}
              />
              <Button
                size="icon"
                variant="outline"
                className={cn('h-10 w-10', {
                  'hover:bg-emerald-700': kv.encoded,
                  'hover:bg-destructive': !kv.encoded,
                })}
                onClick={() => setEncoded(kv.param, !kv.encoded)}
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
                onClick={() => removeParam(kv.param)}
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
      <div className="mt-3 flex flex-row items-center gap-x-1">
        <Input
          type="text"
          placeholder="param"
          value={toAddParam || ''}
          onChange={(e) => setToAddParam(e.target.value)}
        />
        <Button
          size="icon"
          variant="outline"
          className="hover:bg-success h-10 w-10"
          onClick={() => {
            if (toAddParam) {
              addParam(toAddParam, '');
              setToAddParam(null);
            }
          }}
        >
          <Plus
            size={16}
            className="w-10"
          />
        </Button>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="mt-1 w-full"
        onClick={() => {
          requestImport?.();
        }}
      >
        Import from URL
      </Button>
    </div>
  );
}
