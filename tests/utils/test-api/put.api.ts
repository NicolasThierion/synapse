import { Observable } from 'rxjs/Observable';
import { Body, PUT, Synapse, SynapseApi } from '../../../src';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @PUT annotation. For test purpose.
 */
@SynapseApi()
export class PutApi {

  static URL = '/some-path';

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
