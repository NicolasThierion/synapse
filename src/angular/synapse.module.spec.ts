import { async, inject, TestBed } from '@angular/core/testing';
import { AngularSynapseConf, SynapseModule } from './synapse.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

import * as _ from 'lodash';
import { AngularHttpBackendAdapter } from './angular-http-backend-adapter';
import { Synapse } from '../core/core';
import { HttpBackendAdapter } from '../core/http-backend.interface';
import { Observable } from 'rxjs/Observable';
import { TestingModule } from './utils/testing.module';

class CustomAngularHttpBackendAdapter implements HttpBackendAdapter {
  get(url: string, params?: any, headers?: any): Observable<Object> {
    throw new Error('Method not implemented.');
  }

  post(url: string, body?: any, params?: any, headers?: any): Observable<Object> {
    throw new Error('Method not implemented.');
  }

  put(url: string, body?: any, params?: any, headers?: any): Observable<Object> {
    throw new Error('Method not implemented.');
  }

  patch(url: string, body?: any, params?: any, headers?: any): Observable<Object> {
    throw new Error('Method not implemented.');
  }

  delete(url: string, params?: any, headers?: any): Observable<Object> {
    throw new Error('Method not implemented.');
  }
}

describe('SynapseModule.forRoot method', () => {

  describe('when called without setting up BrowserModule', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [SynapseModule.forRoot(TestingModule.SYNAPSE_CONF)],
        providers: []
      });
    }));

    it('should throw an error with useful error msg', async(() => {
      let thrownError: Error = null;

      try {
        inject([SynapseModule], _.noop)();
      } catch (e) {
        thrownError = e;
      }
      expect(thrownError).not.toBeNull();
      expect(thrownError.message).toEqual('Cannot find dependency HttpClient. Make sure you import BrowserModule & HttpClientModule within your root module.');
    }));
  });

  describe('when not called', () => {
    it('should throw when calling Synapse.getConfig()', () => {
      expect(Synapse.getConfig).toThrow();
    });
  });


  describe('with proper HttpClientModule setup', () => {
    afterEach(() => {
      Synapse.teardown();
    });

    it('should call Synapse.init with proper parameters', () => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, HttpClientTestingModule, SynapseModule.forRoot(TestingModule.SYNAPSE_CONF)],
      });
      spyOn(Synapse, 'init').and.callThrough();
      inject([SynapseModule], _.noop)();
      expect(Synapse.init).toHaveBeenCalled();
    });

    describe('when called with no httpBackend parameter', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientModule, HttpClientTestingModule, SynapseModule.forRoot({
            baseUrl: TestingModule.BASE_URL,
            headers: TestingModule.HEADERS
          })],
          providers: []
        });
        // force eager construction of SynapseModule
        inject([SynapseModule], _.noop)();
      }));

      it('should provide the same Synapse config as Synapse.getConfig() through "AngularSynapseConf"', () => {
        inject([AngularSynapseConf], (conf: AngularSynapseConf) => {
          expect(Synapse.getConfig()).toBe(conf as any);
        })();
      });

      it('should wire up HttpBackendAdapter with angular http backend', () => {
        expect(Synapse.getConfig().httpBackend).toEqual(jasmine.any(AngularHttpBackendAdapter));
      });


      it('should set up the provided headers', () => {
        expect(Synapse.getConfig().headers).toEqual(TestingModule.HEADERS);
      });

      it('should set up the provided baseUrl', () => {
        expect(Synapse.getConfig().baseUrl).toEqual(TestingModule.BASE_URL);
      });
    });

    describe('when called with an httpBackend parameter', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientModule, HttpClientTestingModule, SynapseModule.forRoot({
            baseUrl: TestingModule.BASE_URL,
            httpBackend: new CustomAngularHttpBackendAdapter()
          })],
          providers: []
        });
        // force eager construction of SynapseModule
        inject([SynapseModule], _.noop)();
      }));


      it('should wire up HttpBackendAdapter with angular http backend', async(() => {
        expect(Synapse.getConfig().httpBackend instanceof CustomAngularHttpBackendAdapter).toBe(true);
      }));
    });
  });
});
