import { TestingModule } from '../../testing.module';
import { TestBed } from '@angular/core/testing';
import { Spies } from '../../utils/utils';
import { GetApi } from '../../utils/test-api/get.api';
import * as _ from 'lodash';
import { Body, QueryParams, Synapse } from '../../../';
import { BadApi } from '../../utils/test-api/bad.api';
import { PostApi } from '../../utils/test-api/post.api';


describe(`@Body decorator`, () => {
  const spies = Spies.HttpBackend.spies;

  beforeEach(() => {

    // setup modules
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.Global.CONF)],
    });

    Spies.HttpBackend.setup();
  });

  afterEach(() => {
    Synapse.teardown();
  });

  it('should exists', () => {
    expect(Body).toBeDefined();
    expect(Body).toEqual(jasmine.any(Function));
  });

  describe(`When used with @GET`, () => {
    it('should throw an error', () => {
      expect(() => new BadApi().getWithBody(new Date())).toThrowError('cannot specify @Body with method annotated with @Get');
    });
  });

  describe('when used with a method appart from @GET', () => {
    it('should call HttpBackendAdapter with proper body', (done) => {
      const body = new Date();
      new PostApi().postWithBody(body);
      expect(spies.post).toHaveBeenCalled();

      const r1 = spies.post.calls.mostRecent().args[0] as Request;

      return r1.clone().json().then(b => {
        expect(new Date(b)).toEqual(body);
        done();
      }).catch(fail);
    });
  });

});
