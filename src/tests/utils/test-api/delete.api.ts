import { Observable } from 'rxjs/Observable';
import { Body, DELETE, Synapse, SynapseApi } from '../../../';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @DELETE annotation. For test purpose.
 */
@SynapseApi()
export class DeleteApi {

  static URL = '/some-path';

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
