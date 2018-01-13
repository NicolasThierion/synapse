import { Observable } from 'rxjs/Observable';
import { GET, ObserveType, Synapse, SynapseApi } from '../../../src';

/**
 * A fake dummy example of @SynapseApi showing test-cases of @Get annotation. For test purpose.
 */
@SynapseApi({
  requestHandlers: [HandlerApi.Global.requestHandler],
  responseHandlers: [HandlerApi.Global.responseHandler],
  observe: ObserveType.RESPONSE
})
export class HandlerApi {

  static Global = {
    REQUEST_HANDLER_HEADER: 'x-global-request-handler-header',
    RESPONSE_HANDLER_HEADER: 'x-global-response-handler-header',
    requestHandler: (request: Request) => {
      request.headers.set('x-global-request-handler-header', 'x-global-handler-header-value');
    },

    responseHandler: (response: Response) => {
      response.headers.set('x-global-response-handler-header', 'x-global-handler-header-value');
    }
  };

  static Custom = {
    REQUEST_HANDLER_HEADER: 'x-custom-request-handler-header',
    RESPONSE_HANDLER_HEADER: 'x-custom-response-handler-header',
    requestHandler: (request: Request) => {
      request.headers.set('x-custom-request-handler-header', 'x-custom-handler-header-value');
    },
    responseHandler: (response: Response) => {
      response.headers.set('x-custom-response-handler-header', 'x-custom-handler-header-value');
    }
  };

  @GET()
  get(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET({
    requestHandlers: [HandlerApi.Custom.requestHandler],
    responseHandlers: [HandlerApi.Custom.responseHandler]
  })
  getWithCustomHandler(): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
