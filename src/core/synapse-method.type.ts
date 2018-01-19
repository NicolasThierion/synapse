import { SynapseMergedConfig } from '../utils';

/**
 * Method decorated with @GET, @POST, @PUT, @DELETE & @PATCH
 */
export type SynapseMethod = {
  synapseConfig?: SynapseMergedConfig;
  [s: string]: any;
} & ((...args: any[]) => any);
