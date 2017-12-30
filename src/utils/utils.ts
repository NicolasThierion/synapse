import { QueryParametersType } from '../';
import * as qs from 'qs';

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

export function toQueryString(queryParameters: QueryParametersType | Object): string {
 return qs.stringify(queryParameters);
}

export function fromQueryString(queryString: string): Object {
  return qs.parse(queryString);
}

export function joinQueryParams(url: string, queryParams: QueryParametersType): string {
  const queryString = toQueryString(queryParams);
  return [removeTrailingSlash(url), queryString].filter(s => !!s).join('?');
}
