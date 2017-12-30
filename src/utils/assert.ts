export function assert(condition: any, message?: string): void {
  _assertFn(condition, message);
}

export function initAssert(enable: boolean): void {
  _assertFn = _makeAssertFn(enable);
}

type IAssertFn = (condition: any, message?: string) => void;

let _assertFn: IAssertFn = () => {
  throw new Error('Asserts needs environment. Cannot use assert until "initAssert" is called');
};

function _makeAssertFn(enableAsserts: boolean): IAssertFn {
  if (enableAsserts) {
    return function(condition: any, message?: string): void {
      if (!condition) {
        // Create a new `Error`, which automatically gets `stack`
        const err = new Error(message || 'Assertion failed');
        err.stack = (err.stack || {}).toString();
        err.stack = err.stack.split('\n').splice(2).join('\n');
        /* tslint:disable no-debugger */
        // jshint -W087
        debugger;
        /* tslint:enable no-debugger */
        throw err;
      }
    };
  } else {
    return () => {
      // noop
    };
  }
}
