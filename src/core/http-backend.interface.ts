import { Observable } from 'rxjs/Observable';

export interface HttpBackendAdapter {
  get(url: string, params?: any, headers?: any): Observable<Object>;
  post(url: string, body?: any, params?: any, headers?: any): Observable<Object>;
  put(url: string, body?: any, params?: any, headers?: any): Observable<Object>;
  patch(url: string, body?: any, params?: any, headers?: any): Observable<Object>;
  delete(url: string, params?: any, headers?: any): Observable<Object>;
}
