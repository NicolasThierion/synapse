import { environment } from './environments/environment';
import { initAssert } from './utils';

initAssert(environment.asserts);

export * from './public_api';
