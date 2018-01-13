import { SynapseApiReflect } from './synapse-api.reflect';
import { SynapseApiConfig } from '../api-config.type';
import { Constructor } from '../../utils/utils';
import SynapseApiClass = SynapseApiReflect.SynapseApiClass;
/**
 * Use this decorator on your web API class.
 *
 * You can specify an optional resource path to this API, or a complete {@link SynapseApiConfig},
 * that will applies to this class and all of its sub classes.
 *
 * @param confOrCtor
 * @returns
 */
export declare function SynapseApi(confOrCtor?: string | SynapseApiConfig | Constructor<SynapseApiClass>): ClassDecorator | any;
