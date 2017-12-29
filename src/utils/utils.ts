import { QueryParametersType } from '../';

export function removeTrailingSlash(path: string): string {
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  if (path.startsWith('/')) {
    path = path.substring(1);
  }

  return path;
}

export function joinPath(...path: string[]): string {
  return path.map(p => removeTrailingSlash(p))
    .filter(p => !!p)
    .join('/');
}

export function toQueryString(queryParameters: QueryParametersType): string {
  const searchParams = new URLSearchParams();

  Object.keys(queryParameters)
    .forEach(key => [].concat(queryParameters[key]).forEach(qp => searchParams.append(key, qp)));
  return searchParams.toString();
}

export function joinQueryParams(url: string, queryParams: QueryParametersType): string {
  const queryString = toQueryString(queryParams);
  return [removeTrailingSlash(url), queryString].filter(s => !!s).join('?');
}
