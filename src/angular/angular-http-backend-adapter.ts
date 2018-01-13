import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpBackendAdapter } from '../';

/**
 * An angular implementation of {@link HttpBackendAdapter} using {@link HttpClient} as a backend.
 */
export class AngularHttpBackendAdapter implements HttpBackendAdapter {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  async get(request: Request): Promise<Response> {
    const body = await request.blob();
    if (body && body.size) {
      throw new Error('get method should not have body');
    }

    return _toResponsePromise(this._http.get(request.url, _makeOptions(request)));
  }

  async post(request: Request): Promise<Response> {
    const body = await request.blob();

    return _toResponsePromise(this._http.post(request.url, body, _makeOptions(request)));
  }

  async put(request: Request): Promise<Response> {
    const body = await request.blob();

    return _toResponsePromise(this._http.put(request.url, body, _makeOptions(request)));
  }

  async patch(request: Request): Promise<Response> {
    const body = await request.blob();

    return _toResponsePromise(this._http.patch(request.url, body, _makeOptions(request)));
  }

  async delete(request: Request): Promise<Response> {
    const body = await request.blob();
    if (body && body.size) {
      throw new Error('get method should not have body');
    }

    return _toResponsePromise(this._http.delete(request.url, _makeOptions(request)));
  }
}

interface AngularHttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'response' | any;   // typescript will complain that not assignable if not any
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | any;  // typescript will complain that not assignable if not any
  withCredentials?: boolean;
}

function _makeOptions(request: Request): AngularHttpOptions {
  const headers = [...(request.headers as any).keys()].reduce((h, key) => {
    h[key] = request.headers.get(key) as string;

    return h;
  }, {});

  return {
    headers: new HttpHeaders(headers),
    observe: 'response',
    reportProgress: false,
    responseType: 'arraybuffer',       // es6 Response expect a text, so do not let angular do a useless JSON parsing.
    withCredentials: false
  };
}

function _toResponsePromise(observable: Observable<any>): Promise<Response> {
  return observable.map((r: HttpResponse<any>) => {
    return new Response(r.body, {
      headers: new Headers(r.headers.keys()
          .reduce((headers: { [k: string]: string }, key: string) => {
            headers[key] = (r.headers.get(key) as string);

            return headers;
          }, {})),
      status: r.status,
      statusText: r.statusText
    });
  }).toPromise();
}
