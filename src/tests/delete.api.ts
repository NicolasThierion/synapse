import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { DELETE, SynapseApi, Synapse, Body } from '../';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @DELETE annotation. For test purpose.
 */
@SynapseApi()
@Injectable()
export class DeleteApi {

  static URL = '/some-url';

  constructor() {}

  @DELETE()
  delete(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @DELETE(DeleteApi.URL)
  deleteWithUrl(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @DELETE()
  deleteWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
