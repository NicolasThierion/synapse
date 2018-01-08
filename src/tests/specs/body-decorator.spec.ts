import { TestingModule } from '../testing.module';
import { TestBed } from '@angular/core/testing';
import { Spies } from '../utils/utils';
import { Body, Synapse, SynapseApi } from '../../';
import { BadApi } from '../utils/test-api/bad.api';
import { Observable } from 'rxjs/Observable';
import { POST } from '../../';
import { fromQueryString } from '../../utils/utils';

@SynapseApi
class BodyApi {

  static customBodyMapper = function (obj: any): any {
    obj.throughMapper = true;

    return obj;
  };

  @POST()
  postWithBody(@Body() body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  postWithUrlEncodedBody(@Body({contentType: Body.ContentType.X_WWW_URL_ENCODED}) body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }

  @POST()
  postWithMappedBody(@Body({mapper: BodyApi.customBodyMapper}) body: any): Observable<any> {
    return Synapse.OBSERVABLE;
  }
}

describe(`@Body decorator`, () => {
  const spies = Spies.HttpBackend.spies;
  const body = {
    someKey: 'someValue',
    someObject: {
      someOjectKey: 'someObjectValue'
    },
    someArray: ['someArrayValue'],
    'someWeirdKey$"é#?!§': 'someWeirdValueç\\/+{'
  };

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

  describe('when used with a method apart from @GET', () => {
    it('should call HttpBackendAdapter with proper body', (done) => {

      new BodyApi().postWithBody(body).subscribe(() => {
        expect(spies.post).toHaveBeenCalled();

        const r1 = spies.post.calls.mostRecent().args[0] as Request;

        r1.json().then(b => {
          expect(b).toEqual(body);
          done();
        }).catch(fail);

      });
    });
  });

  describe('have a property "contentType", that', () => {
    it('should default to "ContentType.JSON"', (done) => {
      new BodyApi().postWithBody(body)
        .subscribe(() => {
          expect(spies.post).toHaveBeenCalled();
          const r1 = spies.post.calls.mostRecent().args[0] as Request;

          expect(r1.headers.has('Content-Type'));
          expect(r1.headers.get('Content-Type')).toEqual(`${Body.ContentType.JSON}`);
          done();
        });

    });

    it('should be passed to httpBackendAdapter', async () => {
      await new BodyApi().postWithUrlEncodedBody(body).toPromise();
      const r1 = spies.post.calls.mostRecent().args[0] as Request;
      expect(r1.headers.has('Content-Type'));
      expect(r1.headers.get('Content-Type')).toEqual(`${Body.ContentType.X_WWW_URL_ENCODED}`);
    });

    describe('when ContentType.X_WWW_URL_ENCODED', () => {
      it('should pass the body as UrlEncoded', async () => {
        await new BodyApi().postWithUrlEncodedBody(body).toPromise();
        const r1 = spies.post.calls.mostRecent().args[0] as Request;

        r1.text().then(encodedBody => {
          expect(encodedBody).toBeTruthy();
          expect(fromQueryString(encodedBody)).toEqual(body);
        }).catch(fail);
      });
    });
  });

  describe('have a property "mapper", that', () => {
    it('should set a serializer function that is called when body is submitted', async () => {
      await new BodyApi().postWithMappedBody(body).toPromise();
      // /!\ Cannot set spy, because monkey patches on static methods are lost when decorating the class.
      // spyOn(BodyApi, 'customBodyMapper').and.callThrough();

      expect((body as any).throughMapper).toBeTruthy();
    });
  });
});
