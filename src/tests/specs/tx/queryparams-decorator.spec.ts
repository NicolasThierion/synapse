import { TestingModule } from '../../testing.module';
import { TestBed } from '@angular/core/testing';
import { Spies } from '../../utils/utils';
import { GetApi } from '../../utils/test-api/get.api';
import { fromPairs } from 'lodash';
import { QueryParams, Synapse } from '../../../';


describe(`@QueryParams decorator`, () => {
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
    expect(QueryParams).toBeDefined();
    expect(QueryParams).toEqual(jasmine.any(Function));
  });

  const QUERY_PARAMS = {
    qp1: 'qp1Value',
    qp2: true,
    qp3: 1
  };

  const QUERY_PARAMS2 = {
    qp21: 'qp21Value',
    qp2: true,
    qp23: 1,
    qp3: undefined
  };
  const MERGED_QUERY_PARAMS = {
    qp1: 'qp1Value',
    qp2: [true, true],
    qp3: 1,
    qp21: 'qp21Value',
    qp23: 1
  };

  it('should pass queryParams to the adapter', () => {
    new GetApi().getWithQueryParams(QUERY_PARAMS, QUERY_PARAMS2);
    new GetApi().getWithQueryParams(MERGED_QUERY_PARAMS);
    expect(spies.get).toHaveBeenCalled();
    const r1 = spies.get.calls.all()[0].args[0] as Request;
    const r2 = spies.get.calls.all()[1].args[0] as Request;
    expect(r1.url.split('?').length).toEqual(2);
    const qs1 = r1.url.split('?')[1];
    const qs2 = r2.url.split('?')[1];

    expect(fromPairs([...(new URLSearchParams(qs1) as any).entries()]))
      .toEqual(fromPairs([...(new URLSearchParams(qs2) as any).entries()]));
  });

  it('should add query params to any existing query params defined within path', () => {
    new GetApi().getWithMoreQueryParams(QUERY_PARAMS);
    new GetApi().getWithQueryParams(QUERY_PARAMS, {queryParamPresets: 'true'});

    new URLSearchParams().toString();
    expect(spies.get).toHaveBeenCalled();

    const r1 = spies.get.calls.mostRecent().args[0] as Request;
    const r2 = spies.get.calls.all()[1].args[0] as Request;

    expect(r1.url.split('?').length).toEqual(2);
    const qs1 = r1.url.split('?')[1];
    const qs2 = r2.url.split('?')[1];

    expect(fromPairs([...(new URLSearchParams(qs1) as any).entries()]))
      .toEqual(fromPairs([...(new URLSearchParams(qs2) as any).entries()]));
  });
});

