// tslint:disable max-classes-per-file
// tslint:disable no-unnecessary-class
// tslint:disable no-implicit-dependencies

import { inject, TestBed } from '@angular/core/testing';
import { ContentTypeTextApi, Custom, Global, HandlerApi, NoContentTypeApi, Spies, TestingModule } from '../../../tests/utils';
import { SynapseApiReflect } from './synapse-api.reflect';

import { AngularHttpBackendAdapter } from '../../angular';
import { Synapse } from '../core';

import { cloneDeep, merge, noop } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { mergeConfigs } from '../../utils';
import { SynapseConfig } from '../config.type';
import { SynapseApiClass } from '../synapse-api.type';
import { SynapseApi } from './synapse-api.decorator';
import { GET } from './synapse-endpoint.decorator';

const API_PATH = 'some-api-path/';
const EXTENDED_API_PATH = 'some-extended-api-path';
const EXTENDED_API_ENDPOINT = 'extended-endpoint';

@SynapseApi
class Api {
  arg: any;
  constructor(arg: any) {
    this.arg = arg;
  }
}

@SynapseApi()
class ApiWithNoConfig {

}

@SynapseApi(API_PATH)
class ApiWithPath {

}

const customConf = merge(TestingModule.Custom.CONF, {
  path: API_PATH
});

@SynapseApi(customConf)
class ApiWithCompleteConf {

}

const CustomPartialConf = merge({
  path: API_PATH,
  headers: Custom.HEADERS
});

@SynapseApi(CustomPartialConf)
class ApiWithPartialConf {

}

@SynapseApi(customConf)
class ParentApi {
  @GET('some-parent-url')
  getInherited(): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}
@SynapseApi()
class InheritedApi extends ParentApi {

}

@SynapseApi(EXTENDED_API_PATH)
class ExtendedApi extends ParentApi {
  @GET('extended-endpoint')
  getInherited(): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}


@SynapseApi({
  path: EXTENDED_API_PATH,
  mapper: ApiWithMapper.MAPPER
})
class ApiWithMapper {
  static MAPPER = r => Object.assign(r, {mapperCalled: true});
  @GET('mapper-endpoint')
  get(): Observable<any> {
    return Synapse.OBSERVABLE;
  }
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
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
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
      .toEqual([Global.CONF.baseUrl, merge({}, Global.CONF.headers, SynapseConfig.DEFAULT.headers), '']);
    expect(conf.httpBackend).toEqual(jasmine.any(AngularHttpBackendAdapter));
  });

  it('should run through original constructor', () => {
    const api = new Api('arg');
    expect(api.arg).toEqual('arg');
  });

  it('should expose its config through class.synapseConfig', () => {
    const api = new Api('arg');
    const conf = (api as SynapseApiClass).synapseConfig;
    expect(conf).toBeDefined();
    expect(conf).toEqual(SynapseApiReflect.getConf(api.constructor.prototype) as any);
  });

  describe('class.synapseConfig', () => {
    it('should be readonly', () => {
      const api = new Api('arg');
      expect(() => (api as SynapseApiClass).synapseConfig.baseUrl = 'another').toThrow();
      expect(() => (api as SynapseApiClass).synapseConfig.baseUrl).not.toEqual('another');
    });
  });

  describe('with no arg', () => {
    it('should get conf from global Synapse conf', () => {
      const api = new ApiWithNoConfig();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect([conf.baseUrl, conf.headers, conf.path])
        .toEqual([Global.CONF.baseUrl, merge({}, Global.CONF.headers, SynapseConfig.DEFAULT.headers), '']);
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
    it('should use values from provided config and SynapseConfig.DEFAULT', () => {
      const api = new ApiWithCompleteConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = customConf;
      expected.headers = conf.headers;    // merged headers are another test's subject
      expected.httpBackend = conf.httpBackend;  // don't compare backends;
      expect(conf as any)
        .toEqual(mergeConfigs({}, expected, SynapseConfig.DEFAULT));
    });

    it('should merge headers with those from global conf', () => {
      const api = new ApiWithCompleteConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect(conf.headers).toEqual(mergeConfigs({}, Custom.HEADERS, Global.HEADERS, SynapseConfig.DEFAULT.headers));
    });

    it('should merge config with global conf', () => {
      const api = new ApiWithPartialConf();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = mergeConfigs({}, CustomPartialConf, Global.CONF, SynapseConfig.DEFAULT);
      expected.headers = conf.headers;            // merged headers are another test's subject
      expected.httpBackend = conf.httpBackend;    // this is mocked, so don't compare it

      expect(conf as any).toEqual(expected);
    });

    it('should leave global conf untouched', () => {
      let a = new ApiWithCompleteConf();
      a = a;
      for (const k of Object.keys(Global.CONF) as (keyof SynapseConfig)[]) {
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

      xit('= ContentTypeConstants.FORM_DATA, should set content type to "form-data"', () => {
        // TODO implement
        fail('not implemented');
      });

      xit('= ContentTypeConstants.JAVASCRIPT, should set content type to "application/javascript"', () => {
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
    it('should call through the registered handlers', async done => {
      await new HandlerApi().get().toPromise();
      expect(spies.get).toHaveBeenCalled();

      const r = spies.get.calls.mostRecent().args[0] as Request;
      expect(r.headers.has(HandlerApi.Global.REQUEST_HANDLER_HEADER)).toEqual(true);
      done();
    });
  });

  describe('with property "responseHandlers"', () => {
    it('should call through the registered handlers', async done => {
      await new HandlerApi().get()
        .subscribe(response => {
          expect(response.headers.has(HandlerApi.Global.RESPONSE_HANDLER_HEADER)).toEqual(true);
          done();
        });
    });
  });

  describe('extending another class annotated with @SynapseApi', () => {

    beforeEach(() => {
      Spies.HttpBackend.setupFakeSpies(Custom.CONF);
    });

    it('should have prototype of child class', () => {
      const api = new InheritedApi();
      expect(api).toEqual(jasmine.any(InheritedApi));
    });

    it('should inherit configuration from parent classes', () => {
      const api = new InheritedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      const expected = cloneDeep(customConf);
      expected.httpBackend = conf.httpBackend;

      expect(conf).toEqual(mergeConfigs(expected, SynapseConfig.DEFAULT, TestingModule.Global.CONF));
    });

    it('should inherits path from parent class if not path specified', () => {
      const api = new InheritedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect(conf.path).toEqual(customConf.path);
    });

    it('should replace path of parent class if path specified in child class', () => {
      const api = new ExtendedApi();
      const conf = SynapseApiReflect.getConf(api.constructor.prototype);
      expect(conf.path).toEqual(EXTENDED_API_PATH);
    });

    it('should replace path of parent method if path specified in child method', done => {
      // replace httpBackend with spies
      SynapseApiReflect.init(ExtendedApi.prototype, Custom.CONF);
      const api = new ExtendedApi();
      api.getInherited().subscribe(() => {
        const r = spies.get.calls.mostRecent().args[0] as Request;
        const parts = r.url.split('/');
        expect(parts[parts.length - 1]).toEqual(EXTENDED_API_ENDPOINT);
        done();
      });
    });
  });

  describe('with property "mapper"', () => {
    it('should call through the mapper for each methods of API', done => {
      const api = new ApiWithMapper() as SynapseApiClass;
      api.get().subscribe((r: any) => {
        expect(r.mapperCalled).toBeTruthy();
        done();
      });
    });
  });

});
