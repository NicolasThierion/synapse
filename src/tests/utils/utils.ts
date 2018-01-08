import { HttpBackendAdapter } from '../../core/http-backend/http-backend.interface';
import { noop } from 'lodash';
import Spy = jasmine.Spy;
import { inject } from '@angular/core/testing';
import { TestingModule } from '../testing.module';
import { SynapseConfig } from '../../core/config.type';
import { ContentTypeConstants, HeaderConstants } from '../../core/constants';

type HttpSpies = {
  [k in keyof HttpBackendAdapter]?: Spy;
  };

export class Spies {
}

export namespace Spies {
  export class HttpBackend {
    static spies: HttpSpies = {};
    static setupFakeSpies(): void {
      inject([TestingModule], noop)();
      inject([SynapseConfig], (conf) => {
        // setup spies
        [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {

          const fakeHeaders = new Headers();
          fakeHeaders.append(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.JSON);
          HttpBackend.spies[s] = spyOn(conf.httpBackend, s).and.callFake(
            () => Promise.resolve(new Response('["from fake spied httpBackend"]', {headers: fakeHeaders})));
        });
      })();
    }
  }
}
