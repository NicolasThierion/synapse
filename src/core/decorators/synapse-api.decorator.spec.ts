import { inject, TestBed } from '@angular/core/testing';
import { SynapseApi } from './synapse-api.decorator';
import { Custom, Global, TestingModule } from '../../tests/testing.module';
import { SynapseApiReflect } from './synapse-api.reflect';

import { Synapse } from '../core';
import { AngularHttpBackendAdapter } from '../../angular/angular-http-backend-adapter';

import {
  merge,
  noop,
  cloneDeep,
} from 'lodash';
import { SynapseConf } from '../synapse-conf';
import { mergeConfigs } from '../../utils/utils';
import { ContentTypeConstants } from '../constants';
import { ContentTypeTextApi, NoContentTypeApi } from '../../tests/utils/test-api/content-type.api';
import { HandlerApi } from '../../tests/utils/test-api/handler.api';
import { Spies } from '../../tests/utils/utils';

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
  const spies = Spies.HttpBackend.spies;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
    });
    // force eager construction of SynapseModule
    inject([TestingModule], noop)();
    Spies.HttpBackend.setupFakeSpies();
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
      .toEqual([Global.CONF.baseUrl, merge({}, Global.CONF.headers, SynapseConf.DEFAULT.headers), '']);
    expect(conf.httpBackend).toEqual(jasmine.any(AngularHttpBackendAdapter));
  });

  describe('with no arg', () => {
    it('should get conf from global Synapse conf', () => {
      const api = new ApiWithNoConfig();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect([conf.baseUrl, conf.headers, conf.path])
        .toEqual([Global.CONF.baseUrl, merge({}, Global.CONF.headers, SynapseConf.DEFAULT.headers), '']);
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
      expect([conf.baseUrl, conf.path])
        .toEqual([
          Global.CONF.baseUrl,
          API_PATH
        ]);
    });
  });

  describe('with provided custom config', () => {
    it('should use values from provided config and SynapseConf.DEFAULT', () => {
      const api = new ApiWithCompleteConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = CustomConf;
      expected.headers = conf.headers;    // merged headers are another test's subject
      expected.httpBackend = conf.httpBackend;  // don't compare backends;
      expect(conf as any)
        .toEqual(mergeConfigs({}, expected, SynapseConf.DEFAULT));
    });

    it('should merge headers with those from global conf', () => {
      const api = new ApiWithCompleteConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect(conf.headers).toEqual(mergeConfigs({}, Custom.HEADERS, Global.HEADERS, SynapseConf.DEFAULT.headers));
    });

    it('should merge config with global conf', () => {
      const api = new ApiWithPartialConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = mergeConfigs({}, CustomPartialConf, Global.CONF, SynapseConf.DEFAULT);
      expected.headers = conf.headers;            // merged headers are another test's subject
      expected.httpBackend = conf.httpBackend;    // this is mocked, so don't compare it

      expect(conf as any).toEqual(expected);
    });

    it('should leave global conf untouched', () => {
      let a = new ApiWithCompleteConf();
      a = a;
      for (const k of Object.keys(Global.CONF)) {
        expect(Global.CONF[k]).not.toEqual(Custom.CONF[k]);
      }
    });

    describe('with property "contentType"', () => {
      it('not set, should default to "JSON"', done => {
        new NoContentTypeApi().get().subscribe(res => {
          expect(res).toEqual(jasmine.any(Object));
          done();
        });
      });

      it('= ContentTypeConstants.JSON, should set content type to "JSON"', done => {
        new NoContentTypeApi().get().subscribe(res => {
          expect(res).toEqual(jasmine.any(Object));
          done();
        });
      });

      it('= ContentTypeConstants.PLAIN_TEXT, should set content type to "text"', done => {
        new ContentTypeTextApi().get().subscribe(res => {
          expect(res).toEqual(jasmine.any(String));
          done();
        });
      });

      xit('= ContentTypeConstants.FORM_DATA, should set content type to "form-data"', done => {
        // TODO implement
        fail('not implemented');
      });

      xit('= ContentTypeConstants.JAVASCRIPT, should set content type to "application/javascript"', done => {
        // TODO implement
        fail('not implemented');
      });

      xit('= ContentTypeConstants.X_WWW_URL_ENCODED, should set content type to "urlencoded"', () => {
        // TODO implement
        fail('not implemented');
      });
    });
  });

  describe('with property "requestHandlers"', () => {
    it('should call through the registered handlers', async (done) => {
      await new HandlerApi().get().toPromise();
      expect(spies.get).toHaveBeenCalled();

      const r = spies.get.calls.mostRecent().args[0] as Request;
      expect(r.headers.has(HandlerApi.Global.REQUEST_HANDLER_HEADER)).toEqual(true);
      done();
    });
  });

  describe('with property "responseHandlers"', () => {
    it('should call through the registered handlers', async (done) => {
      await new HandlerApi().get()
        .subscribe(response => {
          expect(response.headers.has(HandlerApi.Global.RESPONSE_HANDLER_HEADER)).toEqual(true);
          done();
        });
    });
  });

  describe('extending another class annotated with @SynapseApi', () => {
    it('should have prototype of child class', () => {
      const api = new InheritedApi();
      expect(api).toEqual(jasmine.any(InheritedApi));
    });

    it('should inherit configuration from parent classes', () => {
      const api = new InheritedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = cloneDeep(CustomConf);
      expected.httpBackend = conf.httpBackend;

      expect(conf).toEqual(mergeConfigs(expected, SynapseConf.DEFAULT, TestingModule.Global.CONF));
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
