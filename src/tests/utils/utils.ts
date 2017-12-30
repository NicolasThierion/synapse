import { HttpBackendAdapter } from '../../core/http-backend.interface';
import * as _ from 'lodash';
import Spy = jasmine.Spy;
import { inject } from '@angular/core/testing';
import { AngularSynapseConf } from '../../index';
import { TestingModule } from '../testing.module';

type HttpSpies = {
  [k in keyof HttpBackendAdapter]?: Spy;
  };

export class Spies {
}

export namespace Spies {
  export class HttpBackend {
    static spies: HttpSpies = {};
    static setup(): void {
      inject([TestingModule], _.noop)();
      inject([AngularSynapseConf], (conf) => {
        // setup sp/ies
        [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {
          HttpBackend.spies[s] = spyOn(conf.httpBackend, s).and.callFake(_.noop);
        });
      })();
    }
  }
}
