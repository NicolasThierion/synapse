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
  private static _conf: SynapseConf;
  public static readonly OBSERVABLE = Observable.throw(
    'should only use SynapseConf.OBSERVABLE within a method annotated with @Get, @Post, @Put, @Patch or @Delete');

  public static init(conf: SynapseConf): void {
    if (this._conf) {
      assert(false);
      throw new StateError('Synapse already initialized');
    }
    this._conf = conf;
    this._conf.baseUrl = encodeURI(this._conf.baseUrl);
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

export * from './decorators/decorators';
