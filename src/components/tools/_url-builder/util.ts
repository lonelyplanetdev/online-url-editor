type UrlParts = {
  urlInstance: URL;
  params?: {
    key: string;
    value: string;
    encoded: boolean;
  }[];
};

export const buildUrlFromParts = (parts: UrlParts) => {
  const { urlInstance, params } = parts;
  let paramParts: string[] = [];

  if (params) {
    paramParts = params.map((param) =>
      buildUrlParam(param.key, param.value, param.encoded),
    );
  }

  const urlInstanceWithoutSearch = new URL(urlInstance.toString());
  urlInstanceWithoutSearch.search = '';

  let finalUrl =
    urlInstanceWithoutSearch.toString() +
    (paramParts.length > 0 ? '?' + paramParts.join('&') : '');

  return finalUrl;
};

export const buildUrlParam = (key: string, value: string, encoded: boolean) => {
  console.log('key', key, encoded, value);
  let final = '';
  try {
    try {
      if (value) {
        final = `${encodeURIComponent(key)}=${!encoded ? encodeURIComponent(value) : value}`;
      }
    } catch (error) {
      if (!encoded) throw error;
      final = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
  } catch (error) {
    final = key + '=' + value;
  }

  console.log('final', final);

  return final;
};

export const getUrlParams = (url: string, unencodedParams: string[]) => {
  var params: { key: string; value: string; encoded: boolean }[] = [];

  try {
    const urlInstance = new URL(url);

    params = Array.from(urlInstance.searchParams).map(([key, value]) => ({
      key,
      value,
      encoded: true,
    }));

    params.map((param) => {
      if (unencodedParams.includes(param.key)) {
        param.encoded = false;
      }

      return param;
    });
  } catch (error) {}

  return params;
};
