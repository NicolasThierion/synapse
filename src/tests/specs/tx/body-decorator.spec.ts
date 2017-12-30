import { TestingModule } from '../../testing.module';
import { TestBed } from '@angular/core/testing';
import { Spies } from '../../utils/utils';
import { Body, ContentType, Synapse, SynapseApi } from '../../../';
import { BadApi } from '../../utils/test-api/bad.api';
import { Observable } from 'rxjs/Observable';
import { POST } from '../../../';
import { fromQueryString } from '../../../utils/utils';

@SynapseApi
class BodyApi {

  static customBodyMapper = function(obj: any): any {
    return obj;
  };

  @POST()
  postWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  postWithUrlEncodedBody(@Body({contentType: ContentType.X_WWW_URL_ENCODED}) body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  postWithMappedBody(@Body({mapper: BodyApi.customBodyMapper}) body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}

describe(`@Body decorator`, () => {
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
      new BodyApi().postWithBody(body);
      expect(spies.post).toHaveBeenCalled();

      const r1 = spies.post.calls.mostRecent().args[0] as Request;

      return r1.clone().json().then(b => {
        expect(new Date(b)).toEqual(body);
        done();
      }).catch(fail);
    });
  });

  describe('property "contentType"', () => {

    it('should default to "ContentType.JSON"', () => {
      const body = new Date();
      new BodyApi().postWithBody(body);
      expect(spies.post).toHaveBeenCalled();
      const r1 = spies.post.calls.mostRecent().args[0] as Request;

      expect(r1.headers.has('Content-Type'));
      expect(r1.headers.get('Content-Type')).toEqual(`${ContentType.JSON}`);
    });

    it('should be passed to httpBackendAdapter', () => {
      const body = new Date();
      new BodyApi().postWithUrlEncodedBody(body);

      const r1 = spies.post.calls.mostRecent().args[0] as Request;

      expect(r1.headers.has('Content-Type'));
      expect(r1.headers.get('Content-Type')).toEqual(`${ContentType.X_WWW_URL_ENCODED}`);
    });

    describe('when ContentType.X_WWW_URL_ENCODED', () => {
      it('should pass the body as UrlEncoded', () => {
        const body = {
          someKey: 'someValue',
          someObject: {
            someOjectKey: 'someObjectValue'
          },
          someArray: ['someArrayValue'],
          'someWeirdKey$"é#?!§': 'someWeirdValueç\\/+{'
        };
        new BodyApi().postWithUrlEncodedBody(body);

        const r1 = spies.post.calls.mostRecent().args[0] as Request;

        r1.text().then(encodedBody => {
          expect(encodedBody).toBeTruthy();
          expect(fromQueryString(encodedBody)).toEqual(body);

        }).catch(fail);
      });
    });
  });
});
