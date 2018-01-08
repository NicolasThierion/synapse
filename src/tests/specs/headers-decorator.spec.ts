import { Headers as SHeaders } from '../../';
import { Global, TestingModule } from '../testing.module';
import { TestBed } from '@angular/core/testing';
import { Spies } from '../utils/utils';
import { GetApi } from '../utils/test-api/get.api';
import { defaults } from 'lodash';
import { Synapse } from '../../';

// @SynapseApi()
// class C {
//
//   // Won't even execute.
//   // @Headers()
//   // a() {
//   // }
// }

describe(`@Headers decorator`, () => {
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
    expect(SHeaders).toBeDefined();
    expect(SHeaders).toEqual(jasmine.any(Function));
  });

  const HEADERS = {
    'x-some-custom-header-parameter': 'x-some-custom-header-parameter-value'
  };

  it('should merge headers with global headers', async(done) => {
    await new GetApi().getWithHeaders(HEADERS);
    const r = spies.get.calls.mostRecent().args[0] as Request;
    expect(r.headers).toEqual(new Headers(defaults(HEADERS, Global.HEADERS)));
    done();
  });

  it('should merge headers with @SynapseApi headers', async(done) => {
    await new GetApi.WithHeaders().getWithHeaders(HEADERS);
    const r = spies.get.calls.mostRecent().args[0] as Request;
    expect(r.headers).toEqual(new Headers(defaults(HEADERS, Global.HEADERS, GetApi.WithHeaders.HEADERS)));
    done();
  });
});

