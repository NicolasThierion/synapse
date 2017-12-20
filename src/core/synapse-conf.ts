import { HttpBackendAdapter } from './http-backend.interface';

export class SynapseConf {
  baseUrl: string;
  httpBackend: HttpBackendAdapter;
  headers?: Object;
}
