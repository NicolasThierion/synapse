// tslint:disable no-implicit-dependencies
import { inject, TestBed } from '@angular/core/testing';

import { noop } from 'lodash';
import { Observable } from 'rxjs/Observable';
import {
  BadApi,
  DeleteApi,
  GetApi,
  Global,
  HandlerApi,
  NoContentTypeApi,
  PatchApi,
  PostApi,
  PutApi,
  Spies,
  TestingModule,
  User,
  UsersApi } from '../../tests/utils';
import { DELETE, GET, PATCH, POST, PUT, Synapse, TypedResponse } from '../core';
import { SynapseApi } from '../core/decorators';
import { SynapseMethod } from '../core/synapse-method.type';
import { joinPath, removeTrailingSlash } from '../utils';

@SynapseApi()
class UniqueApi {
  @GET()
  get(): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}

describe('', () => {

  const spies = Spies.HttpBackend.spies;
  afterEach(() => {
    Synapse.teardown();
  });

  describe('@GET annotation', () => {

    beforeEach(() => {
      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
      });
      // force eager construction of SynapseModule
      inject([TestingModule], noop)();
    });

    it('should exists', () => {
      expect(GET).toBeDefined();
      expect(GET).toEqual(jasmine.any(Function));
    });

    describe('.synapseConfig', () => {

      it('should offer conf', () => {
        const m = ((new GetApi().get) as SynapseMethod);
        expect(m.synapseConfig).toBeDefined();
      });

      xit('should offer conf even if class was never construct', () => {
        expect((UniqueApi.prototype.get as SynapseMethod).synapseConfig).toBeDefined();
      });

    });

    describe('when called', () => {
      beforeEach(() => Spies.HttpBackend.setupFakeSpies());

      it('should call registered HttpBackendAdapter\'s get method', async done => {
        await new GetApi().get().toPromise();
        expect(spies.get).toHaveBeenCalled();
        expect(spies.get.calls.mostRecent().args[0]).toEqual(jasmine.any(Request));
        done();
      });
    });
  });

  describe('@POST annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
      });
      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(POST).toBeDefined();
      expect(POST).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it('should call registered HttpBackendAdapter\'s post method', async done => {
        await new PostApi().post().toPromise();
        expect(spies.post).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('@PUT annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
      });

      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(PUT).toBeDefined();
      expect(PUT).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it('should call registered HttpBackendAdapter\'s put method', async done => {
        await new PutApi().put().toPromise();
        expect(spies.put).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('@PATCH annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
      });
      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(PATCH).toBeDefined();
      expect(PATCH).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it('should call registered HttpBackendAdapter\'s patch method', async done => {
        await new PatchApi().patch().toPromise();
        expect(spies.patch).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('@DELETE annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
      });
      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(DELETE).toBeDefined();
      expect(DELETE).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it('should call registered HttpBackendAdapter\'s delete method', async done => {
        await new DeleteApi().delete().toPromise();
        expect(spies.delete).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('@GET, @POST, @PUT, @PATCH, @DELETE', () => {
    beforeEach(() => {
      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
      });
      // force eager construction of SynapseModule
      inject([TestingModule], noop)();
    });

    beforeEach(() => Spies.HttpBackend.setupFakeSpies());

    it('when some args are missing decorator', () => {
      expect(() => new BadApi().getWithMissingParamDecorator(1)).toThrowError(/missing/);
    });

    it('should call httpBackendAdapter method with proper global configuration', async done => {

      await new GetApi().get().toPromise();
      const r = spies.get.calls.mostRecent().args[0] as Request;
      expect(removeTrailingSlash(r.url)).toEqual(removeTrailingSlash(Global.BASE_URL));
      expect(r.headers).toEqual(new Headers(Global.HEADERS));
      done();
    });

    describe('with an annotated path', () => {
      it('should append the provided path to the global baseUrl', async done => {
        await new GetApi.WithPath().get().toPromise();
        expect(spies.get).toHaveBeenCalled();

        const r = spies.get.calls.mostRecent().args[0] as Request;
        expect(r.url).toEqual(joinPath(Global.BASE_URL, GetApi.WithPath.PATH));
        done();
      });

      describe('that requires pathParams', () => {
        it('should throw an error if @PathParams not specified', () => {
          expect(() => new BadApi().getWithMissingPathParameter())
            .toThrowError(/param ":missingPathParam" not provided/);
        });
      });
    });

    describe('with an annotated path and baseUrl', () => {
      it('should append the provided path to the provided baseUrl', async done => {
        await new GetApi.WithBaseUrlAndPath().get().toPromise();
        expect(spies.get).toHaveBeenCalled();

        const r = spies.get.calls.mostRecent().args[0] as Request;
        expect(r.url).toEqual(joinPath(GetApi.WithBaseUrlAndPath.BASEURL, GetApi.WithBaseUrlAndPath.PATH));
        done();
      });
    });

    describe('with property "requestHandlers"', () => {
      it('should call through the registered handlers', async done => {
        await new HandlerApi().getWithCustomHandler().toPromise();
        expect(spies.get).toHaveBeenCalled();

        const r = spies.get.calls.mostRecent().args[0] as Request;
        expect(r.headers.has(HandlerApi.Global.REQUEST_HANDLER_HEADER)).toEqual(true);
        expect(r.headers.has(HandlerApi.Custom.REQUEST_HANDLER_HEADER)).toEqual(true);
        done();
      });
    });

    describe('with property "responseHandlers"', () => {
      it('should call through the registered handlers', async done => {
        await new HandlerApi().getWithCustomHandler()
          .subscribe(response => {
            expect(response.headers.has(HandlerApi.Global.RESPONSE_HANDLER_HEADER)).toEqual(true);
            expect(response.headers.has(HandlerApi.Custom.RESPONSE_HANDLER_HEADER)).toEqual(true);
            done();
          });
      });
    });

    describe('have a property "observe", that', () => {
      it('should default to "ObserveType.BODY"', () => {
        new GetApi().get().subscribe(res => {
          expect(res).not.toEqual(jasmine.any(Response));
        });
      });

      describe('when equals "ObserveType.RESPONSE"', () => {
        it('should return an object of type response ', done => {
          new HandlerApi().get().subscribe((res: TypedResponse<any>) => {
            expect(res).toEqual(jasmine.any(TypedResponse));
            done();
          });
        });

        it('should map the response\'s body according to registered mapper', done => {
          new UsersApi().getOneWithObserveResponse(1).subscribe(res => {
            expect(res).toEqual(jasmine.any(TypedResponse));
            expect(res.body).toEqual(jasmine.any(User));
            done();
          }, fail);
        });
      });

    });

    describe('after called', () => {
      describe('on a method that returns a promise', () => {
        it('should return a promise', () => {
          const ret = new GetApi().getThatReturnsAPromise();
          expect(ret).toEqual(jasmine.any(Promise));
        });
      });

      describe('on a method that returns an observable', () => {
        it('should return an observable', () => {
          expect(new GetApi().get()).toEqual(jasmine.any(Observable));
        });
      });
    });

    describe('if property "mapper" is present', () => {
      it('should pass response through the mapper', done => {
        new UsersApi().getOne(1).subscribe(user => {
          expect(user).toEqual(jasmine.any(User));
          done();
        }, fail);
      });

      describe('if the response is an array', () => {
        it('should each item of the array through the mapper', done => {
          spies.get.and.callThrough();
          new UsersApi().getPage().subscribe(users => {
            expect(users).toEqual(jasmine.any(Array));
            expect(users[0]).toEqual(jasmine.any(User));
            done();
          }, fail);
        });
      });
    });

    describe('property "contentType"', () => {
      it('should default to JSON', done => {
        new NoContentTypeApi().get().subscribe(any => {
          expect(any).toEqual(jasmine.any(Object));
          done();
        }, fail);
      });

      it('should override return type', done => {
        new NoContentTypeApi().getThatOverrideContentType().subscribe(any => {
          expect(any).toEqual(jasmine.any(String));
          done();
        }, fail);
      });
    });
  });
});
