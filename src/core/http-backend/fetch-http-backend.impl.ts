// TODO unit tests


import { HttpBackendAdapter } from './http-backend.interface';

export class FetchApiBackendAdapter implements HttpBackendAdapter {
  get(request: Request): Promise<Response> {
    return fetch(request);
  }
  post(request: Request): Promise<Response> {
    return fetch(request);

  }
  put(request: Request): Promise<Response> {
    return fetch(request);

  }
  patch(request: Request): Promise<Response> {
    return fetch(request);

  }
  delete(request: Request): Promise<Response> {
    return fetch(request);

  }
}
