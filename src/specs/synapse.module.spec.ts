import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { merge, noop } from 'lodash';

import { AngularHttpBackendAdapter } from '../angular';

import { TestingModule } from '../../tests/utils';
import { SynapseModule } from '../angular';
import { HttpBackendAdapter } from '../core/http-backend';
import { Synapse, SynapseConfig } from '../index';

class CustomAngularHttpBackendAdapter implements HttpBackendAdapter {
  get(request: Request): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  post(request: Request): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  put(request: Request): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  patch(request: Request): Promise<Response> {
    throw new Error('Method not implemented.');
  }

  delete(request: Request): Promise<Response> {
    throw new Error('Method not implemented.');
  }
}

describe('SynapseModule.forRoot method', () => {

  describe('when called without setting up BrowserModule', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [SynapseModule.forRoot(TestingModule.Global.CONF)],
        providers: []
      });
    }));

    it('should throw an error with useful error msg', async(() => {
      let thrownError: Error;

      try {
        inject([SynapseModule], noop)();
      } catch (e) {
        thrownError = e;
      }
      expect(thrownError).not.toBeNull();
      expect(thrownError.message).toEqual('Cannot find dependency HttpClient.' +
        ' Make sure you import BrowserModule & HttpClientModule within your root module.');
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
        imports: [HttpClientModule, HttpClientTestingModule, SynapseModule.forRoot(TestingModule.Global.CONF)]
      });
      spyOn(Synapse, 'init').and.callThrough();
      inject([SynapseModule], noop)();
      expect(Synapse.init).toHaveBeenCalled();
    });

    describe('when called with no httpBackend parameter', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientModule, HttpClientTestingModule, SynapseModule.forRoot({
            baseUrl: TestingModule.Global.BASE_URL,
            headers: TestingModule.Global.HEADERS
          })],
          providers: []
        });

        // force eager construction of SynapseModule
        inject([SynapseModule], noop)();
      }));

      it('should provide the same "AngularSynapseConf" as Synapse.getConfig()',
        inject([SynapseConfig], (conf: SynapseConfig) => {
          expect(Synapse.getConfig()).toBe(conf as any);
        }));

      it('should wire up HttpBackendAdapter with angular http backend', () => {
        expect(Synapse.getConfig().httpBackend).toEqual(jasmine.any(AngularHttpBackendAdapter));
      });

      it('should set up the provided headers', () => {
        expect(Synapse.getConfig().headers).toEqual(merge({}, TestingModule.Global.HEADERS, SynapseConfig.DEFAULT.headers));
      });

      it('should set up the provided baseUrl', () => {
        expect(Synapse.getConfig().baseUrl).toEqual(TestingModule.Global.BASE_URL);
      });
    });

    describe('when called with an httpBackend parameter', () => {
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientModule, HttpClientTestingModule, SynapseModule.forRoot({
            baseUrl: TestingModule.Global.BASE_URL,
            httpBackend: new CustomAngularHttpBackendAdapter()
          })],
          providers: []
        });
        // force eager construction of SynapseModule
        inject([SynapseModule], noop)();
      }));

      it('should wire up HttpBackendAdapter with angular http backend', async(() => {
        expect(Synapse.getConfig().httpBackend instanceof CustomAngularHttpBackendAdapter).toBe(true);
      }));
    });

  });
});
