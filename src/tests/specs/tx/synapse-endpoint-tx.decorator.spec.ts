import { TestBed } from '@angular/core/testing';

import { Global, TestingModule } from '../../testing.module';
import { Synapse, DELETE, GET, PATCH, POST, PUT } from '../../../';
import { GetApi } from '../../utils/test-api/get.api';
import { BadApi } from '../../utils/test-api/bad.api';
import { joinPath, removeTrailingSlash } from '../../../utils/utils';
import { PostApi } from '../../utils/test-api/post.api';
import { PutApi } from '../../utils/test-api/put.api';
import { PatchApi } from '../../utils/test-api/patch.api';
import { DeleteApi } from '../../utils/test-api/delete.api';
import { Spies } from '../../utils/utils';
import { Observable } from 'rxjs/Observable';

describe('', () => {

  const spies = Spies.HttpBackend.spies;
  afterEach(() => {
    Synapse.teardown();
  });

  describe('@GET annotation', () => {

    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
      });

      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(GET).toBeDefined();
      expect(GET).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's get method`, () => {
        new GetApi().get();
        expect(spies.get).toHaveBeenCalled();
        expect(spies.get.calls.mostRecent().args[0]).toEqual(jasmine.any(Request));
      });

      it(`should call get method with proper global configuration`, () => {
        new GetApi().get();
        const r = spies.get.calls.mostRecent().args[0] as Request;
        expect(removeTrailingSlash(r.url)).toEqual(removeTrailingSlash(Global.BASE_URL));
        expect(r.headers).toEqual(new Headers(Global.HEADERS));
      });

      describe('with an annotated path', () => {
        it('should append the provided path to the global baseUrl', () => {
          new GetApi.WithPath().get();
          expect(spies.get).toHaveBeenCalled();

          const r = spies.get.calls.mostRecent().args[0] as Request;
          expect(r.url).toEqual(joinPath(Global.BASE_URL, GetApi.WithPath.PATH));
        });

        describe('that requires pathParams', () => {
          it('should throw an error if @PathParams not specified', () => {
            expect(() => new BadApi().getWithMissingPathParameter())
              .toThrowError(/param ":missingPathParam" not provided/);
          });
        });
      });

      describe('with an annotated path and baseUrl', () => {
        it('should append the provided path to the provided baseUrl', () => {
          new GetApi.WithBaseUrlAndPath().get();
          expect(spies.get).toHaveBeenCalled();

          const r = spies.get.calls.mostRecent().args[0] as Request;
          expect(r.url).toEqual(joinPath(GetApi.WithBaseUrlAndPath.BASEURL, GetApi.WithBaseUrlAndPath.PATH));
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
  });

  describe('@POST annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
      });
      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(POST).toBeDefined();
      expect(POST).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's post method`, () => {
        new PostApi().post();
        expect(spies.post).toHaveBeenCalled();
      });
    });
  });

  describe('@PUT annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
      });

      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(PUT).toBeDefined();
      expect(PUT).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's put method`, () => {
        new PutApi().put();
        expect(spies.put).toHaveBeenCalled();
      });
    });
  });

  describe('@PATCH annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
      });
      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(PATCH).toBeDefined();
      expect(PATCH).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's put method`, () => {
        new PatchApi().patch();
        expect(spies.patch).toHaveBeenCalled();
      });
    });
  });

  describe('@DELETE annotation', () => {
    beforeEach(() => {

      // setup modules
      TestBed.configureTestingModule({
        imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
      });
      Spies.HttpBackend.setupFakeSpies();
    });

    it('should exists', () => {
      expect(DELETE).toBeDefined();
      expect(DELETE).toEqual(jasmine.any(Function));
    });

    describe('when called', () => {
      it(`should call registered HttpBackendAdapter's put method`, () => {
        new DeleteApi().delete();
        expect(spies.delete).toHaveBeenCalled();
      });
    });
  });
});
