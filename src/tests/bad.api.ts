import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GET, SynapseApi, Synapse} from '../index';
import { Body } from '../core/decorators/parameters.decorator';
import { POST } from '../core/decorators/synapse-endpoint.decorator';

/**
 * An example of badly used SynapseApi. For testing purpose only.
 */
@SynapseApi()
@Injectable()
export class BadApi {

  /**
   * Badly using @GET with a body. Should throw an error.
   * @param body
   * @returns {Observable<any>}
   */
  @GET()
  getWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  @GET()
  multipleAnnotations(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  postMultipleBody(@Body() body1, @Body() body2): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
