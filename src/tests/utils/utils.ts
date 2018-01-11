import { noop } from 'lodash';
import { inject } from '@angular/core/testing';
import { HttpBackendAdapter } from '../../core/http-backend';
import { TestingModule } from '../testing.module';
import { SynapseConfig } from '../../';
import { ContentTypeConstants, HeaderConstants } from '../../core/constants';

import Spy = jasmine.Spy;

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
            () => Promise.resolve(new Response(JSON.stringify(_fakeUser()), {headers: fakeHeaders})));
        });
      })();
    }
  }
}


function _fakeUser() {
  return {
    name: 'fake firstName fake lastName',
    username: 'fake username',
    id: 0,
    street: 'fake street',
    city: 'fake city',
    zipcode: 'fake zipcode'
  };
}
