import { inject, TestBed } from '@angular/core/testing';
import { SynapseApi } from './synapse-api.decorator';
import { Custom, Global, TestingModule } from '../../angular/utils/testing.module';
import { SynapseApiReflect } from './synapse-api.reflect';

import { Synapse } from '../core';
import { AngularHttpBackendAdapter } from '../../angular/angular-http-backend-adapter';

import * as _ from 'lodash';

const API_PATH = 'some-api-path';
const EXTENDED_API_PATH = 'some-extended-api-path';

@SynapseApi()
class Api {

}

@SynapseApi(API_PATH)
class ApiWithPath {

}

const CustomConf = _.merge(TestingModule.Custom.CONF, {
  path: API_PATH
});

@SynapseApi(CustomConf)
class ApiWithCompleteConf {

}

const CustomPartialConf = _.merge({
  path: API_PATH,
  headers: Custom.HEADERS
});

@SynapseApi(CustomPartialConf)
class ApiWithPartialConf {

}

@SynapseApi(CustomConf)
class ParentApi {

}

@SynapseApi(EXTENDED_API_PATH)
class InheritedApi extends ParentApi {

}

describe('@SynapseApi annotation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
    });
    // force eager construction of SynapseModule
    inject([TestingModule], _.noop)();
  });

  afterEach(() => {
    Synapse.teardown();
  });

  it('should exists', () => {
    expect(SynapseApi).toBeDefined();
    expect(SynapseApi).toEqual(jasmine.any(Function));
  });

  it('should get conf from global Synapse conf', () => {
    const api = new Api();
    const conf = SynapseApiReflect.getConf(api.constructor.prototype);
    expect([conf.baseUrl, conf.headers, conf.path])
      .toEqual([Global.CONF.baseUrl, Global.CONF.headers, '']);
    expect(conf.httpBackend).toEqual(jasmine.any(AngularHttpBackendAdapter));
  });

  describe('with provided path', () => {
    it('should extend global conf with provided path', () => {
      const api = new ApiWithPath();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect([conf.baseUrl, conf.headers, conf.path])
        .toEqual([Global.CONF.baseUrl, Global.CONF.headers, API_PATH]);
    });
  });

  describe('with provided custom config', () => {
    it('should use values from provided config', () => {
      const api = new ApiWithCompleteConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = CustomConf;
      delete conf.headers;
      delete expected.headers;
      expect(conf as any)
        .toEqual(expected);
    });

    it('should merge headers with those from global conf', () => {
      const api = new ApiWithCompleteConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect(conf.headers).toEqual(_.defaults({}, Custom.HEADERS, Global.HEADERS));
    });

    it('should merge config with global conf', () => {
      const api = new ApiWithPartialConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = _.defaults({}, CustomPartialConf, Global.CONF);
      delete expected.headers;
      delete expected.httpBackend;
      delete conf.headers;
      delete conf.httpBackend;

      expect(conf as any).toEqual(expected);
    });

    it('should leave global conf untouched', () => {
      const conf = SynapseApiReflect.getConf(new ApiWithCompleteConf().constructor.prototype);

      for (const k of Object.keys(Global.CONF)) {
        expect(Global.CONF[k]).not.toEqual(Custom.CONF[k]);
      }
    });
  });

  describe('extending another class annotated with @SynapseApi', () => {
    it('should have prototype of daughter class', () => {
      const api = new InheritedApi();
      expect(api ).toEqual(jasmine.any(InheritedApi));
    });

    it('should inherit configuration from parent classe', () => {
      const api = new InheritedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = _.defaults({path: EXTENDED_API_PATH}, CustomConf);

      // don't conpare headers as they are merged with globals
      delete expected.headers;
      delete conf.headers;

      expect(conf).toEqual(expected);
    });
  });
});
