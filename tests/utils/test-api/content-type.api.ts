// tslint:disable max-classes-per-file

import { Observable } from 'rxjs/Observable';
import { ContentTypeConstants, GET, Synapse, SynapseApi } from '../../../src/core';

@SynapseApi({
  baseUrl: 'http://localhost:3000',
  path: 'users'
})
export class LocalHost3000Api {
  @GET()
  get(): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @GET({
    contentType: ContentTypeConstants.PLAIN_TEXT
  })
  getThatOverrideContentType(): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}

@SynapseApi({
    contentType: ContentTypeConstants.JSON
  }
)
export class ContentTypeJsonApi extends LocalHost3000Api {
}

@SynapseApi()
export class NoContentTypeApi extends LocalHost3000Api {
}

@SynapseApi({
  contentType: ContentTypeConstants.PLAIN_TEXT
})
export class ContentTypeTextApi extends LocalHost3000Api {
}
