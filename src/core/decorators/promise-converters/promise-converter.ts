import { isFunction, noop } from 'lodash';
import { PromiseConverter } from './promise-converter-store';

export class PromiseConverterImpl implements PromiseConverter {
  convert<T>(promise: Promise<T>): Promise <T> {
    return promise;
  }

  accept(convertTo: any): boolean {
    const isPromise = isFunction((convertTo as any).then);

    if (isPromise) {
      const promise = convertTo as Promise<any>;
      if (promise.catch) {
        (promise).catch(noop);  // 'handle' the Synapse.PROMISE error to mute chrome warning
      }
    }

    return isPromise;
  }
}
