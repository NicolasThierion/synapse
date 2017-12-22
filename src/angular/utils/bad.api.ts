import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GET, SynapseApi, Synapse} from '../../index';
import { Body } from '../../core/decorators/parameters.decorator';
import { POST } from '../../core/decorators/synapse-endpoint.decorator';

@SynapseApi()
@Injectable()
export class BadApi {
  @GET()
  getWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  @GET()
  multipleAnnotations(): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
