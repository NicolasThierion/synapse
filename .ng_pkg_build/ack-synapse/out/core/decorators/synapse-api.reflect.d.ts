import 'reflect-metadata';
import { SynapseConfig } from '../config.type';
import { BodyParams } from './parameters.decorator';
import { SynapseApiConfig } from '../api-config.type';
export declare namespace SynapseApiReflect {
    class DecoratedArgs {
        readonly path: number[];
        readonly query: number[];
        readonly headers: number[];
        body: {
            index: number;
            params: BodyParams;
        };
    }
    /**
     * Class decorated with @SynapseApi
     */
    interface SynapseApiClass {
    }
    function init(classPrototype: SynapseApiClass, conf: SynapseApiConfig): void;
    function getConf(classPrototype: SynapseApiClass): SynapseApiConfig & SynapseConfig;
    function hasConf(classPrototype: SynapseApiClass): boolean;
    function addPathParamArg(): ParameterDecorator;
    function addQueryParamsArg(): ParameterDecorator;
    function addHeadersArg(): ParameterDecorator;
    function addBodyArg(params: BodyParams): ParameterDecorator;
    function getDecoratedArgs(target: Object, key: string | symbol): DecoratedArgs;
    function addHandler(): void;
}
