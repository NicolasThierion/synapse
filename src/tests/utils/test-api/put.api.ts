import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { PUT, SynapseApi, Synapse, Body } from '../../../';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @PUT annotation. For test purpose.
 */
@SynapseApi()
@Injectable()
export class PutApi {

  static URL = '/some-path';

  constructor() {}

  @PUT()
  put(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @PUT(PutApi.URL)
  putWithUrl(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @PUT()
  putWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
