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
  static PARAMETERIZED_URL = '/some-url/:pathParam1/:pathParam2';
  static QUERYPARAMS_URL = '?queryParamPresets=true';

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
  getWithParameterizedUrl(@PathParam() first: string, @PathParam() second: string): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET()
  getWithHeaders(@Headers() headers: Object): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET()
  getWithQueryParams(@QueryParams() parameters1: any, @QueryParams() parameters2: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET(GetApi.QUERYPARAMS_URL)
  getWithMoreQueryParams(@QueryParams() parameter: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}

export namespace GetApi {

  @SynapseApi({
    baseUrl: WithBaseUrl.BASEURL
  })
  export class WithBaseUrl extends GetApi {
    static readonly BASEURL = 'https://some-api-with-custom-base-url:80';
  }

  @SynapseApi({
    path: WithPath.PATH
  })
  export class WithPath extends GetApi {
    static readonly PATH = 'with-path';
  }

  @SynapseApi({
    headers: WithHeaders.HEADERS
  })
  export class WithHeaders extends GetApi {
    static readonly HEADERS = {
      'x-with-headers': 'x-with-headers-value'
    };
  }

  @SynapseApi({
    baseUrl: WithBaseUrlAndPath.BASEURL,
    path: WithBaseUrlAndPath.PATH
  })
  export class WithBaseUrlAndPath extends GetApi {
    static readonly BASEURL = 'https://some-api-with-custom-base-url:80';
    static readonly PATH = 'with-path';
  }
}
