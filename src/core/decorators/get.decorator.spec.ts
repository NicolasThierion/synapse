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
  });

  describe('when decorated with a path', () => {
    describe(`that doesn't require pathParams`, () => {
      it('should append the provided path to baseUrl', () => {
        new GetApi.WithPath().get();
        expect(CONF.httpBackend.get).toHaveBeenCalledWith(joinPath(Global.BASE_URL, GetApi.WithPath.PATH), {}, Global.HEADERS);
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

      it('should append the provided path to baseUrl, replacing pathParams', () => {
        new GetApi().getWithParameterizedUrl('a', 'b');
        expect(CONF.httpBackend.get)
          .toHaveBeenCalledWith(joinPath(Global.BASE_URL, 'some-url/a/b'), {}, Global.HEADERS);
      });
    });
  });
});

