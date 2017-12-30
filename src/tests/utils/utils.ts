import { HttpBackendAdapter } from '../../core/http-backend.interface';
import { noop } from 'lodash';
import Spy = jasmine.Spy;
import { inject } from '@angular/core/testing';
import { AngularSynapseConf } from '../../';
import { TestingModule } from '../testing.module';

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
      inject([AngularSynapseConf], (conf) => {
        // setup sp/ies
        [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {
          HttpBackend.spies[s] = spyOn(conf.httpBackend, s).and.callFake(noop);
        });
      })();
    }
  }
}
