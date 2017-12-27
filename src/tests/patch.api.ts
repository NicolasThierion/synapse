import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { PATCH, SynapseApi, Synapse, Body } from '../';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @PATCH annotation. For test purpose.
 */
@SynapseApi()
@Injectable()
export class PatchApi {

  static URL = '/some-url';

  constructor() {}

  @PATCH()
  patch(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @PATCH(PatchApi.URL)
  patchWithUrl(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @PATCH()
  patchWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
