import { cloneDeep, defaults } from 'lodash';
import { isUndefined } from 'util';

export class TypedResponse<T> {
  readonly body: T;
  readonly headers: Headers;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;
  readonly redirected: boolean;

  clone(): TypedResponse<T> {
    return new TypedResponse<T>(cloneDeep(this.body as T), defaults({body: undefined}, this));
  }

  constructor(body?: T, init: ResponseInit | Response = {}) {
    this.body = body;

    if (isUndefined((init as Response).url)) {
      const i = init as ResponseInit;
      defaults(this, new Response(undefined, i));
    } else {
      const r = init as Response;
      defaults(this, r);
    }
  }
}
