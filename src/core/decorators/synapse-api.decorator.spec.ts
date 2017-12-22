import { async, inject, TestBed } from '@angular/core/testing';
import { SynapseApi } from './synapse-api.decorator';
import {SYNAPSE_CONF, TestingModule} from '../../angular/utils/testing.module';
import { SynapseApiReflect } from './synapse-api.reflect';
import createSpy = jasmine.createSpy;

import * as _ from 'lodash';
import { Synapse } from '../core';

@SynapseApi()
class Api {

}

@SynapseApi()
class ApiWithPath {

}

describe('@SynapseApi annotation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule.forRoot(TestingModule.SYNAPSE_CONF)],
    });
    // force eager construction of SynapseModule
    inject([TestingModule], _.noop)();
  });

  afterEach(() => {
    Synapse.teardown();
  });

  it('should exists', () => {
    expect(SynapseApi).toBeDefined();
    expect(SynapseApi).toEqual(jasmine.any(Function));
  });

  it('should get called when created a new annotated class', () => {
    const api = new Api();
    const conf = SynapseApiReflect.getConf(api);
    expect(conf).toEqual(SYNAPSE_CONF as any);
  });

  xit('should get conf from global SYnapse conf', () => {
    const api = new Api();
    const conf = SynapseApiReflect.getConf(api);
  });
});
