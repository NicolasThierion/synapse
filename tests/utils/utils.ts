// tslint:disable max-classes-per-file
// tslint:disable no-unnecessary-class
// tslint:disable no-implicit-dependencies

import { inject } from '@angular/core/testing';
import { noop } from 'lodash';
import { TestingModule } from './testing.module';

import Spy = jasmine.Spy;
import { ContentTypeConstants, HeaderConstants, SynapseConfig } from '../../src/core';
import { HttpBackendAdapter } from '../../src/core/http-backend';

type HttpSpies = {
  [k in keyof HttpBackendAdapter]?: Spy;
  };
export class Spies {
}

export namespace Spies {
  export class HttpBackend {
    static spies: HttpSpies = {};
    static setupFakeSpies(conf?: SynapseConfig): void {
      inject([TestingModule], noop)();
      inject([SynapseConfig], (globalConf: SynapseConfig) => {
        // setup spies
        [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {

          const fakeHeaders = new Headers();
          fakeHeaders.append(HeaderConstants.CONTENT_TYPE, ContentTypeConstants.JSON);
          HttpBackend.spies[s] = spyOn((conf || globalConf).httpBackend, s).and.callFake(
            () => Promise.resolve(new Response(JSON.stringify(_fakeUser()), {headers: fakeHeaders})));
        });
      })();
    }
  }
}

function _fakeUser(): any {
  return {
    name: 'fake firstName fake lastName',
    username: 'fake username',
    id: 0,
    street: 'fake street',
    city: 'fake city',
    zipcode: 'fake zipcode'
  };
}
