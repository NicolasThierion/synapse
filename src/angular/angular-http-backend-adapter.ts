import { HttpBackendAdapter } from '../core/http-backend.interface';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * An angular implementation of {@link HttpBackendAdapter} using {@link HttpClient} as a backend.
 */
export class AngularHttpBackendAdapter implements HttpBackendAdapter {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  get(url: string, params?: any, headers?: any): Observable<Object> {
    return this._http.get(url, _makeOptions(params, headers));
  }

  post(url: string, body?: any, params?: any, headers?: any): Observable<Object> {
    return this._http.post(url, body, _makeOptions(params, headers));
  }

  put(url: string, body?: any, params?: any, headers?: any): Observable<Object> {
    return this._http.put(url, body, _makeOptions(params, headers));
  }

  patch(url: string, body?: any, params?: any, headers?: any): Observable<Object> {
    return this._http.patch(url, body, _makeOptions(params, headers));
  }

  delete(url: string, params?: any, headers?: any): Observable<Object> {
    return this._http.delete(url, _makeOptions(params, headers));
  }

}

interface AngularHttpOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

function _makeOptions(params: any, headers: any): AngularHttpOptions {
  return {
    headers: headers as HttpHeaders,
    observe: 'body',
    params: params as HttpParams,
    reportProgress: false,
    responseType: 'json',
    withCredentials: false,
  };
}
