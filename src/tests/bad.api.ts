import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GET, SynapseApi, Synapse, PathParam, QueryParams, Headers } from '../index';
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

  @GET('/some/:missingPathParam')
  getWithMissingPathParameter(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET('/:only1')
  getWithTooMuchPathParams(@PathParam() firstParam: string, @PathParam() secondParam: string): Observable<any> {
    return Synapse.OBSERVABLE;
  }


  @GET('/:param1/:param1')
  getWithTwiceTheSamePathParam(@PathParam() param1: 'a', @PathParam() param2: 'b'): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET('/:needsStringOrNumber')
  getWithBadPathParam(@PathParam() param: Object = new Date()): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET()
  getWithBadHeader(@Headers() header: boolean = false): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET()
  getWithBadQueryParam(@QueryParams() param: boolean = false, param2: Object = {obj: new Date()}): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  @GET()
  multipleAnnotations(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  // won't even compile
  // @POST()
  // postMultipleBody(@Body() body1, @Body() body2): Observable<any> {
  //   return Synapse.OBSERVABLE;
  // }
}
