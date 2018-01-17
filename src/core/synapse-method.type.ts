import { SynapseApiConfig } from './api-config.type';

/**
 * Method decorated with @GET, @POST, @PUT, @DELETE & @PATCH
 */
export type SynapseMethod = {
  synapseConfig?: SynapseApiConfig;
  [s: string]: any;
} & ((...args: any[]) => any);
