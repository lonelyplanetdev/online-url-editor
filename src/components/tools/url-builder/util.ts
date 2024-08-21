export function getQueryParamsFromString(
  queryString: string,
): Record<string, string> {
  const searchParams = new URLSearchParams(queryString);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

export function getQueryStringFromParams(
  params: Record<string, string>,
  macros: string[] = [],
): string {
  if (Object.keys(params).length === 0) return '';

  const searchParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    searchParams[encodeURIComponent(key)] =
      macros.length > 0 && macros.includes(key)
        ? encodeURIComponent(value)
        : value.replace(/[\;\?\:\@\&\=\+\$\,\/]/g, '');
  }

  var finalQueryString =
    '?' +
    Array.from(Object.entries(searchParams))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

  return finalQueryString;
}

export function parseURL(url: string) {
  try {
    const urlInstance = new URL(url);

    const queryString = urlInstance.search;
    const href = (() => {
      const subUrlInstance = new URL(urlInstance);
      subUrlInstance.search = '';

      return subUrlInstance.href;
    })();

    return { uri: href, queryString };
  } catch (error) {
    return { uri: null, queryString: null };
  }
}

export function buildURL(
  uri: string,
  params: Record<string, string>,
  macros: string[],
): string {
  const queryString = getQueryStringFromParams(params, macros);

  return uri + queryString;
}

export type URLBuilderTemplate = {
  id: string;
  name: string;
  fields: URLBuilderTemplateField[];
};

export type URLBuilderTemplateField = {
  key: string;
  type: 'text' | 'list';
  defaultValue: string;
  hidden: boolean;
  encoded: boolean;
};
