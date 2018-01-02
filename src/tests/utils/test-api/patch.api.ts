import { Observable } from 'rxjs/Observable';
import { PATCH, SynapseApi, Synapse, Body } from '../../../';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @PATCH annotation. For test purpose.
 */
@SynapseApi()
export class PatchApi {

  static URL = '/some-path';

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
