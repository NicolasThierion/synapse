import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GET, Headers, PathParam, QueryParams, SynapseApi, Synapse} from '../';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @Get annotation. For test purpose.
 */
@SynapseApi()
@Injectable()
export class GetApi {

  static URL = '/some-url';
  static PARAMETERIZED_URL = '/some-url/:pathParam';

  constructor() {}

  @GET()
  get(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET(GetApi.URL)
  getWithUrl(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET({
    url: GetApi.URL
  })
  getWithEndpointParameterUrl(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET(GetApi.PARAMETERIZED_URL)
  getWithParameterizedUrl(@PathParam() parameter: string): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET()
  getWithHeaders(@Headers() parameter: string): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET()
  getWithQueryParams(@QueryParams() parameter: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}

export namespace GetApi {

  @SynapseApi({
    baseUrl: WithBaseUrl.BASEURL
  })
  export class WithBaseUrl extends GetApi {
    static readonly BASEURL = 'https://some-api-with-custom-base-url';
  }

  @SynapseApi({
    path: 'users'
  })
  export class WithPath extends GetApi {
    static readonly PATH = 'with-path';
  }

  @SynapseApi({
    baseUrl: WithBaseUrl.BASEURL,
    path: 'users'
  })
  export class WithBaseUrlAndPath extends GetApi {
    static readonly BASEURL = 'https://some-api-with-custom-base-url';
    static readonly PATH = 'with-path';
  }
}
