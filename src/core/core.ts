import { Observable } from 'rxjs/Observable';
import { SynapseConf } from './synapse-conf';
import '../utils/rxjs-import';
import { assert } from '../utils/assert';

class StateError extends Error {
  constructor(s: string) {
    super(s);
  }
}

export class Synapse {
  public static readonly OBSERVABLE = Observable.throw(
    'should only use SynapseConf.OBSERVABLE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  public static readonly PROMISE = Promise.reject(
    'should only use SynapseConf.PROMISE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  private static _conf: SynapseConf;

  public static init(conf: SynapseConf): void {
    if (this._conf) {
      assert(false);
      throw new StateError('Synapse already initialized');
    }
    this._conf = conf;
  }

  public static getConfig(): SynapseConf {
    if (!this._conf) {
      throw new StateError('Synapse not initialized');
    }
    return this._conf;
  }

  public static teardown(): void {
    this._conf = null;
  }
}

export enum ContentType {
  FORM_DATA = 'form-data',
  X_WWW_URL_ENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  PLAIN_TEXT = 'text/plain',
  JSON = 'application/json',
  JAVASCRIPT = 'application/javascript'
}

export enum HttpMethod {
  GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE', PATCH = 'PATCH'
}

export type HttpRequestHandler = (request: Request) => void;
export type HttpResponseHandler = (response: Response) => void;

export * from './decorators/decorators';

