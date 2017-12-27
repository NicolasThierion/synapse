import { inject, TestBed } from '@angular/core/testing';
import { SynapseApi } from './synapse-api.decorator';
import { Custom, Global, TestingModule } from '../../tests/testing.module';
import { SynapseApiReflect } from './synapse-api.reflect';

import { Synapse } from '../core';
import { AngularHttpBackendAdapter } from '../../angular/angular-http-backend-adapter';

import * as _ from 'lodash';
import { GET } from './synapse-endpoint.decorator';
import { AngularSynapseConf } from '../../angular/synapse.module';
import { GetApi } from '../../tests/get.api';
import { BadApi } from '../../tests/bad.api';
import { joinPath } from '../../utils/utils';

describe('@GET annotation', () => {
  let CONF: AngularSynapseConf;
  const OTHERS: any[] = ['post', 'put', 'patch', 'delete'];
  beforeEach(() => {

    // setup modules
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
    });
    // force eager construction of SynapseModule
    inject([TestingModule], _.noop)();
    inject([AngularSynapseConf], (conf) => {
      CONF = conf;
    })();

    // setup spies
    spyOn(CONF.httpBackend, 'get').and.callThrough();

    OTHERS.forEach(m => {
      spyOn(CONF.httpBackend, m).and.callThrough();
    });
  });

  afterEach(() => {
    Synapse.teardown();
    OTHERS.forEach(m => {
      expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
    });
  });

  it('should exists', () => {
    expect(GET).toBeDefined();
    expect(GET).toEqual(jasmine.any(Function));
  });

  describe('when called', () => {
    it(`should call registered HttpBackendAdapter's get method`, () => {
      new GetApi().get();
      expect(CONF.httpBackend.get).toHaveBeenCalled();
    });

    it(`should not call any other method of HttpBackendAdapter`, () => {

      new GetApi().get();
      OTHERS.forEach(m => {
        expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
      });
    });

    it(`should call get method with proper global configuration`, () => {
      new GetApi().get();
      expect(CONF.httpBackend.get).toHaveBeenCalledWith(Global.BASE_URL, {}, Global.HEADERS);
    });

    it('with a @Body should throw an error', () => {
      expect(() => new BadApi().getWithBody(new Date())).toThrowError('cannot specify @Body with method annotated with @Get');
    });

    describe('with @Headers', function () {
      const HEADERS = {
        'x-some-custom-header-parameter': 'x-some-custom-header-parameter-value'
      };

      it('should merge headers with global headers', () => {
        new GetApi().getWithHeaders(HEADERS);
        expect(CONF.httpBackend.get).toHaveBeenCalledWith(Global.BASE_URL, {}, _.defaults(HEADERS, Global.HEADERS));
      });

      it('should merge headers with @SynapseApi headers', () => {
        new GetApi.WithHeaders().getWithHeaders(HEADERS);
        expect(CONF.httpBackend.get).toHaveBeenCalledWith(Global.BASE_URL,
          {},
          _.defaults(HEADERS, Global.HEADERS, GetApi.WithHeaders.HEADERS));
      });
    });

    describe('with @QueryParams', function () {
      const QUERY_PARAMS = {
        qp1: 'qp1Value',
        qp2: true,
        qp3: 1
      };

      const QUERY_PARAMS2 = {
        qp21: 'qp21Value',
        qp2: true,
        qp23: 1,
        qp3: undefined
      };

      const MERGED_QUERY_PARAMS = {
        qp1: 'qp1Value',
        qp2: [true, true],
        qp3: 1,
        qp21: 'qp21Value',
        qp23: 1
      };

      it('should pass queryParams to the adapter', () => {
        new GetApi().getWithQueryParams(QUERY_PARAMS, QUERY_PARAMS2);
        new URLSearchParams().toString();
        expect(CONF.httpBackend.get).toHaveBeenCalledWith(Global.BASE_URL, MERGED_QUERY_PARAMS, jasmine.any(Object));
      });

      it('should add query params to any existing query params defined within path', () => {
        new GetApi().getWithMoreQueryParams(QUERY_PARAMS);
        new URLSearchParams().toString();
        expect(CONF.httpBackend.get)
          .toHaveBeenCalledWith(Global.BASE_URL,
          _.merge(QUERY_PARAMS,
            {queryParamPresets: 'true'}),
          jasmine.any(Object));
      });
    });

  });

  describe('when decorated with a path', () => {
    describe(`that doesn't require pathParams`, () => {
      it('should append the provided path to the global baseUrl', () => {
        new GetApi.WithPath().get();
        expect(CONF.httpBackend.get).toHaveBeenCalledWith(joinPath(Global.BASE_URL, GetApi.WithPath.PATH),
          jasmine.any(Object),
          jasmine.any(Object));
      });

      it('should throw an error if @PathParams specified', () => {
        expect(() => new BadApi().getWithTooMuchPathParams('a', 'b'))
          .toThrowError(/Too many @PathParam provided/);
      });
    });

    describe('that requires pathParams', () => {
      it('should throw an error if @PathParams not specified', () => {
        expect(() => new BadApi().getWithMissingPathParameter())
          .toThrowError(/param ":missingPathParam" not provided/);
      });

      it('should append the provided path to the global baseUrl, replacing pathParams', () => {
        new GetApi().getWithParameterizedUrl('a', 'b');
        expect(CONF.httpBackend.get)
          .toHaveBeenCalledWith(joinPath(Global.BASE_URL, 'some-url/a/b'),
            jasmine.any(Object),
            jasmine.any(Object));
      });
    });
  });

  describe('when decorated with a path and baseUrl', () => {
    it('should append the provided path to the provided baseUrl', () => {
      new GetApi.WithBaseUrlAndPath().get();
      expect(CONF.httpBackend.get)
        .toHaveBeenCalledWith(joinPath(GetApi.WithBaseUrlAndPath.BASEURL, GetApi.WithBaseUrlAndPath.PATH),
          jasmine.any(Object),
          jasmine.any(Object));
    });
  });
});

function _toQueryString(obj: any): string {
  return   Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}
