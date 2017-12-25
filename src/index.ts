import { initAssert } from './utils/assert';
import { environment } from '../tests/e2e/environments/environment';

initAssert(!environment.production);

export * from './core/core';
export * from './angular/synapse.module';
