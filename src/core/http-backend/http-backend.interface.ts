export interface HttpBackendAdapter {
  get(request: Request): Promise<Response>;
  post(request: Request): Promise<Response>;
  put(request: Request): Promise<Response>;
  patch(request: Request): Promise<Response>;
  delete(request: Request): Promise<Response>;
}
