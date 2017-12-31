import { inject, TestBed } from '@angular/core/testing';
import { SynapseApi } from './synapse-api.decorator';
import { Custom, Global, TestingModule } from '../../tests/testing.module';
import { SynapseApiReflect } from './synapse-api.reflect';

import { Synapse } from '../core';
import { AngularHttpBackendAdapter } from '../../angular/angular-http-backend-adapter';

import {
  merge,
  noop,
  defaults,
  cloneDeep,
} from 'lodash';

const API_PATH = 'some-api-path/';
const EXTENDED_API_PATH = '/some-extended-api-path';

@SynapseApi
class Api {
  constructor(a: any) {}
}

@SynapseApi()
class ApiWithNoConfig {

}

@SynapseApi(API_PATH)
class ApiWithPath {

}

const CustomConf = merge(TestingModule.Custom.CONF, {
  path: API_PATH
});

@SynapseApi(CustomConf)
class ApiWithCompleteConf {

}

const CustomPartialConf = merge({
  path: API_PATH,
  headers: Custom.HEADERS
});

@SynapseApi(CustomPartialConf)
class ApiWithPartialConf {

}

@SynapseApi(CustomConf)
class ParentApi {

}
@SynapseApi()
class InheritedApi extends ParentApi {

}

@SynapseApi(EXTENDED_API_PATH)
class ExtendedApi extends ParentApi {

}

const STATIC_ATTRIBUTE_VALUE = 'someStaticAttrValue';
const ATTRIBUTE_VALUE = 'someAttrValue';
@SynapseApi('ApiWithAttributes')
class ApiWithAttributes {
  static readonly someStaticAttr = STATIC_ATTRIBUTE_VALUE;
  someAttr: string;

  constructor() {
    this.someAttr = ATTRIBUTE_VALUE;
  }
}

describe('@SynapseApi annotation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
    });
    // force eager construction of SynapseModule
    inject([TestingModule], noop)();
  });

  afterEach(() => {
    Synapse.teardown();
  });

  it('should exists', () => {
    expect(SynapseApi).toBeDefined();
    expect(SynapseApi).toEqual(jasmine.any(Function));
  });

  it('should get conf from global Synapse conf', () => {
    const api = new Api('arg');
    const conf = SynapseApiReflect.getConf(api.constructor.prototype);
    expect([conf.baseUrl, conf.headers, conf.path])
      .toEqual([Global.CONF.baseUrl, Global.CONF.headers, '']);
    expect(conf.httpBackend).toEqual(jasmine.any(AngularHttpBackendAdapter));
  });

  describe('with no arg', () => {
    it('should get conf from global Synapse conf', () => {
      const api = new ApiWithNoConfig();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect([conf.baseUrl, conf.headers, conf.path])
        .toEqual([Global.CONF.baseUrl, Global.CONF.headers, '']);
      expect(conf.httpBackend).toEqual(jasmine.any(AngularHttpBackendAdapter));
    });
  });

  it ('should call through class constructor', () => {
    const api = new ApiWithAttributes();
    expect(api.someAttr).toEqual(ATTRIBUTE_VALUE);
  });

  it ('should preserve static attributes of annotated class', () => {
    expect(ApiWithAttributes.someStaticAttr).toEqual(STATIC_ATTRIBUTE_VALUE);
  });

  describe('with provided path', () => {
    it('should extend global conf with provided path', () => {
      const api = new ApiWithPath();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect([conf.baseUrl, conf.headers, conf.path])
        .toEqual([
          Global.CONF.baseUrl,
          Global.CONF.headers,
          API_PATH
        ]);
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
      expect(conf.headers).toEqual(defaults({}, Custom.HEADERS, Global.HEADERS));
    });

    it('should merge config with global conf', () => {
      const api = new ApiWithPartialConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = defaults({}, CustomPartialConf, Global.CONF);
      delete expected.headers;
      delete expected.httpBackend;
      delete conf.headers;
      delete conf.httpBackend;

      expect(conf as any).toEqual(expected);
    });

    it('should leave global conf untouched', () => {
      let a = new ApiWithCompleteConf();
      a = a;
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

    it('should inherit configuration from parent classes', () => {
      const api = new InheritedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = cloneDeep(CustomConf);
      expect(conf).toEqual(merge(expected, {headers: merge(expected.headers, conf.headers)}) as any);
    });

    it('should inherits path from parent class if not path specified', () => {
      const api = new InheritedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect(conf.path).toEqual(CustomConf.path);
    });

    it('should replace path of parent class if path specified', () => {
      const api = new ExtendedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect(conf.path).toEqual(EXTENDED_API_PATH);
    });
  });
});
