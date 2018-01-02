import { Observable } from 'rxjs/Observable';
import { POST, SynapseApi, Synapse, Body } from '../../../';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @POST annotation. For test purpose.
 */
@SynapseApi()
export class PostApi {

  static URL = '/some-path';

  @POST()
  post(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST(PostApi.URL)
  postWithUrl(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  postWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
