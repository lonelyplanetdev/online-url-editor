import { Label } from '~/components/ui/label';
import { UrlDetail } from './detail';
import { Separator } from '~/components/ui/separator';
import {
  useUrlBuilderStore,
  BaseParam,
} from '~/components/tools/url-builder/store';
import { buildUrlFromParts } from '~/components/tools/url-builder/util';
import dynamic from 'next/dynamic';

export function UrlDetails() {
  const urls = useUrlBuilderStore((state) => state.urls);
  const selected = useUrlBuilderStore((state) => state.selected);
  const upsertUrl = useUrlBuilderStore((state) => state.upsertUrl);

  const selectedUrl = urls.find((url) => url.id === selected);

  if (!selectedUrl) return null;

  var urlInstance: URL;

  try {
    urlInstance = new URL(selectedUrl.base);
  } catch (error) {
    return null;
  }

  function handleDetailChange(key: string, value: string) {
    if (!selectedUrl || !selected) return;

    switch (key) {
      case 'hostname':
        urlInstance.hostname = value;
        break;
      case 'pathname':
        urlInstance.pathname = value;
        break;
    }

    const isDynamic = selectedUrl.params?.dynamic ? true : false;
    const searchParams = isDynamic
      ? selectedUrl.params.dynamic
      : selectedUrl.params.fieldValues;
    const templateSelected = selectedUrl.params.template;

    const builtUrl = buildUrlFromParts({
      urlInstance,
      params: searchParams,
    });

    upsertUrl(selected, {
      base: builtUrl,
      params: isDynamic
        ? { dynamic: searchParams }
        : { template: templateSelected, fieldValues: searchParams },
    });
  }

  return (
    <div className="grid w-full items-center">
      <Label className="text-md font-semibold">Details</Label>
      <Separator className="my-1.5" />
      <div className="space-y-4">
        <UrlDetail
          title="Hostname"
          placeholder="hostname.com"
          defaultValue={urlInstance.hostname}
          onValueChange={(value) => handleDetailChange('hostname', value)}
        />
        <UrlDetail
          title="Pathname"
          placeholder="/path/to/resource"
          defaultValue={urlInstance.pathname}
          onValueChange={(value) => handleDetailChange('pathname', value)}
        />
      </div>
    </div>
  );
}
