// tslint:disable no-implicit-dependencies

import { TestBed } from '@angular/core/testing';
import { BadApi, GetApi, Global, Spies, TestingModule } from '../../tests/utils';
import { Synapse } from '../core';
import { joinPath } from '../utils';

describe('@PathParam decorator', () => {
  const spies = Spies.HttpBackend.spies;

  beforeEach(() => {

    // setup modules
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)]
    });

    Spies.HttpBackend.setupFakeSpies();
  });

  afterEach(() => {
    Synapse.teardown();
  });

  describe('when used with an endpoint that requires some pathParam', () => {
    it('should replace corresponding pathParams within url', async () => {
      await new GetApi().getWithParameterizedUrl('a', 'b');
      expect(spies.get).toHaveBeenCalled();

      const r = spies.get.calls.mostRecent().args[0] as Request;
      expect(r.url).toEqual(joinPath(Global.BASE_URL, 'some-path/a/b'));
    });
  });

  describe('when used with an endpoint that does not requires any pathParam', () => {
    it('should throw an error if @PathParams specified', () => {
      expect(() => new BadApi().getWithTooMuchPathParams('a', 'b'))
        .toThrowError(/Too many @PathParam provided/);
    });
  });
});
