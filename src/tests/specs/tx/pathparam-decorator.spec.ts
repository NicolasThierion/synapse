import { Global, TestingModule } from '../../testing.module';
import { TestBed } from '@angular/core/testing';
import { Spies } from '../../utils/utils';
import { GetApi } from '../../utils/test-api/get.api';
import { Synapse } from '../../../';
import { BadApi } from '../../utils/test-api/bad.api';
import { joinPath } from '../../../utils/utils';


describe(`@PathParam decorator`, () => {
  const spies = Spies.HttpBackend.spies;

  beforeEach(() => {

    // setup modules
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
    });

    Spies.HttpBackend.setupFakeSpies();
  });

  afterEach(() => {
    Synapse.teardown();
  });

  describe('when used with an endpoint that requires some pathParam', () => {
    it('should replace corresponding pathParams within url', () => {
      new GetApi().getWithParameterizedUrl('a', 'b');
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
