import { Headers as SHeaders, SynapseApi } from '../../../';
import { Global, TestingModule } from '../../testing.module';
import { TestBed } from '@angular/core/testing';
import { Spies } from '../../utils/utils';
import { GetApi } from '../../utils/test-api/get.api';
import * as _ from 'lodash';
import { Synapse } from '../../../index';

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

    Spies.HttpBackend.setup();
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

  it('should merge headers with global headers', () => {
    new GetApi().getWithHeaders(HEADERS);
    const r = spies.get.calls.mostRecent().args[0] as Request;
    expect(r.headers).toEqual(new Headers(_.defaults(HEADERS, Global.HEADERS)));
  });

  it('should merge headers with @SynapseApi headers', () => {
    new GetApi.WithHeaders().getWithHeaders(HEADERS);
    const r = spies.get.calls.mostRecent().args[0] as Request;
    expect(r.headers).toEqual(new Headers(_.defaults(HEADERS, Global.HEADERS, GetApi.WithHeaders.HEADERS)));
  });
});

