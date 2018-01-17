import { SynapseApiConfig } from './api-config.type';
import { SynapseMethod } from './synapse-method.type';

/**
 * Class decorated with @SynapseApi
 */
export interface SynapseApiClass {
  synapseConfig?: SynapseApiConfig;
  [k: string]: SynapseMethod | any;
}
