import { inject, TestBed } from '@angular/core/testing';
import { Global, TestingModule } from '../../test-utils/testing.module';

import { Synapse } from '../core';

import * as _ from 'lodash';
import { DELETE, GET, PATCH, POST, PUT } from './synapse-endpoint.decorator';
import { AngularSynapseConf } from '../../';
import { GetApi } from '../../test-utils/test-api/get.api';
import { BadApi } from '../../test-utils/test-api/bad.api';
import { joinPath, removeTrailingSlash } from '../../utils/utils';
import { PostApi } from '../../test-utils/test-api/post.api';
import { PutApi } from '../../test-utils/test-api/put.api';
import { PatchApi } from '../../test-utils/test-api/patch.api';
import { DeleteApi } from '../../test-utils/test-api/delete.api';
import Spy = jasmine.Spy;
import { HttpBackendAdapter } from '../http-backend.interface';
import 'core-js/fn/object/entries';

type HttpSpies = {
  [k in keyof HttpBackendAdapter]?: Spy;
};

describe('', () => {

  let CONF: AngularSynapseConf;
  const spies: HttpSpies = {};
  afterEach(() => {
    Synapse.teardown();
  });

  describe('@GET annotation', () => {
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
      [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {
        spies[s] = spyOn(CONF.httpBackend, s).and.callFake(_.noop);
      });
    });

    afterEach(() => {
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
        expect(spies.get.calls.mostRecent().args[0]).toEqual(jasmine.any(Request));
      });

      it(`should not call any other method of HttpBackendAdapter`, () => {

        new GetApi().get();
        OTHERS.forEach(m => {
          expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
        });
      });

      it(`should call get method with proper global configuration`, () => {
        new GetApi().get();
        const r = spies.get.calls.mostRecent().args[0] as Request;
        expect(removeTrailingSlash(r.url)).toEqual(removeTrailingSlash(Global.BASE_URL));
        expect(r.headers).toEqual(new Headers(Global.HEADERS));
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
          const r = spies.get.calls.mostRecent().args[0] as Request;
          expect(r.headers).toEqual(new Headers(_.defaults(HEADERS, Global.HEADERS)));
        });

        it('should merge headers with @SynapseApi headers', () => {
          new GetApi.WithHeaders().getWithHeaders(HEADERS);
          const r = spies.get.calls.mostRecent().args[0] as Request;
          expect(r.headers).toEqual(new Headers(_.defaults(HEADERS, Global.HEADERS, GetApi.WithHeaders.HEADERS)));
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
          new GetApi().getWithQueryParams(MERGED_QUERY_PARAMS);
          expect(CONF.httpBackend.get).toHaveBeenCalled();
          const r1 = spies.get.calls.all()[0].args[0] as Request;
          const r2 = spies.get.calls.all()[1].args[0] as Request;
          expect(r1.url.split('?').length).toEqual(2);
          const qs1 = r1.url.split('?')[1];
          const qs2 = r2.url.split('?')[1];

          expect(_.fromPairs([...(new URLSearchParams(qs1) as any).entries()]))
            .toEqual(_.fromPairs([...(new URLSearchParams(qs2) as any).entries()]));
        });

        it('should add query params to any existing query params defined within path', () => {
          new GetApi().getWithMoreQueryParams(QUERY_PARAMS);
          new GetApi().getWithQueryParams(QUERY_PARAMS, {queryParamPresets: 'true'});

          new URLSearchParams().toString();
          expect(CONF.httpBackend.get)
            .toHaveBeenCalled();

          const r1 = spies.get.calls.mostRecent().args[0] as Request;
          const r2 = spies.get.calls.all()[1].args[0] as Request;

          expect(r1.url.split('?').length).toEqual(2);
          const qs1 = r1.url.split('?')[1];
          const qs2 = r2.url.split('?')[1];

          expect(_.fromPairs([...(new URLSearchParams(qs1) as any).entries()]))
            .toEqual(_.fromPairs([...(new URLSearchParams(qs2) as any).entries()]));
        });
      });

    });

    describe('when decorated with a path', () => {
      describe(`that doesn't require pathParams`, () => {
        it('should append the provided path to the global baseUrl', () => {
          new GetApi.WithPath().get();
          expect(CONF.httpBackend.get).toHaveBeenCalled();

          const r = spies.get.calls.mostRecent().args[0] as Request;
          expect(r.url).toEqual(joinPath(Global.BASE_URL, GetApi.WithPath.PATH));
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
            .toHaveBeenCalled();

          const r = spies.get.calls.mostRecent().args[0] as Request;
          expect(r.url).toEqual(joinPath(Global.BASE_URL, 'some-path/a/b'));
        });
      });
    });

    describe('when decorated with a path and baseUrl', () => {
      it('should append the provided path to the provided baseUrl', () => {
        new GetApi.WithBaseUrlAndPath().get();
        expect(CONF.httpBackend.get)
          .toHaveBeenCalled();

        const r = spies.get.calls.mostRecent().args[0] as Request;
        expect(r.url).toEqual(joinPath(GetApi.WithBaseUrlAndPath.BASEURL, GetApi.WithBaseUrlAndPath.PATH));
      });
    });
  });

  describe('@POST annotation', () => {
    const OTHERS: any[] = ['get', 'put', 'patch', 'delete'];

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
      [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {
        spies[s] = spyOn(CONF.httpBackend, s).and.callFake(_.noop);
      });
    });

    afterEach(() => {
      OTHERS.forEach(m => {
        expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
      });
    });

    it('should exists', () => {
      expect(POST).toBeDefined();
      expect(POST).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's post method`, () => {
        new PostApi().post();
        expect(CONF.httpBackend.post).toHaveBeenCalled();
      });

      it(`should not call any other method of HttpBackendAdapter`, () => {

        new PostApi().post();
        OTHERS.forEach(m => {
          expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
        });
      });

      it('with a @Body should call HttpBackendAdapter with proper body', (done) => {
        const body = new Date();
        new PostApi().postWithBody(body);
        expect(CONF.httpBackend.post).toHaveBeenCalled();

        const r1 = spies.post.calls.mostRecent().args[0] as Request;

        return r1.clone().json().then(b => {
          expect(new Date(b)).toEqual(body);
          done();
        }).catch(fail);
      });
    });
  });

  describe('@PUT annotation', () => {
    const OTHERS: any[] = ['get', 'post', 'patch', 'delete'];
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
      [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {
        spies[s] = spyOn(CONF.httpBackend, s).and.callFake(_.noop);
      });
    });

    afterEach(() => {
      OTHERS.forEach(m => {
        expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
      });
    });

    it('should exists', () => {
      expect(PUT).toBeDefined();
      expect(PUT).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's put method`, () => {
        new PutApi().put();
        expect(CONF.httpBackend.put).toHaveBeenCalled();
      });

      it(`should not call any other method of HttpBackendAdapter`, () => {
        new PutApi().put();
        OTHERS.forEach(m => {
          expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('@PATCH annotation', () => {
    const OTHERS: any[] = ['get', 'post', 'put', 'delete'];
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
      [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {
        spies[s] = spyOn(CONF.httpBackend, s).and.callFake(_.noop);
      });

    });

    afterEach(() => {
      OTHERS.forEach(m => {
        expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
      });
    });

    it('should exists', () => {
      expect(PATCH).toBeDefined();
      expect(PATCH).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's put method`, () => {
        new PatchApi().patch();
        expect(CONF.httpBackend.patch).toHaveBeenCalled();
      });

      it(`should not call any other method of HttpBackendAdapter`, () => {
        new PatchApi().patch();
        OTHERS.forEach(m => {
          expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('@DELETE annotation', () => {
    const OTHERS: any[] = ['get', 'post', 'put', 'patch'];
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
      [ 'get', 'post', 'put', 'patch', 'delete'].forEach((s: keyof HttpBackendAdapter) => {
        spies[s] = spyOn(CONF.httpBackend, s).and.callFake(_.noop);
      });
    });

    afterEach(() => {
      OTHERS.forEach(m => {
        expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
      });
    });

    it('should exists', () => {
      expect(DELETE).toBeDefined();
      expect(DELETE).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's put method`, () => {
        new DeleteApi().delete();
        expect(CONF.httpBackend.delete).toHaveBeenCalled();
      });

      it(`should not call any other method of HttpBackendAdapter`, () => {
        new DeleteApi().delete();
        OTHERS.forEach(m => {
          expect(CONF.httpBackend[m]).not.toHaveBeenCalled();
        });
      });
    });
  });
});
