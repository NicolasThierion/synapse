/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import 'reflect-metadata';
import { assert } from '../../utils/assert';
import { cloneDeep, isNumber } from 'lodash';
import { StateError } from '../../utils/state-error';
import { Synapse } from '../core';
import { SynapseError } from '../../utils/synapse-error';
import { mergeConfigs } from '../../utils/utils';
const /** @type {?} */ DECORATED_PARAMETERS_KEY = 'HttpParamDecorator';
const /** @type {?} */ CONF_KEY = 'SynapseApiConfig';
export var SynapseApiReflect;
(function (SynapseApiReflect) {
    class DecoratedArgs {
        constructor() {
            this.path = [];
            this.query = [];
            this.headers = [];
        }
    }
    SynapseApiReflect.DecoratedArgs = DecoratedArgs;
    function DecoratedArgs_tsickle_Closure_declarations() {
        /** @type {?} */
        DecoratedArgs.prototype.path;
        /** @type {?} */
        DecoratedArgs.prototype.query;
        /** @type {?} */
        DecoratedArgs.prototype.headers;
        /** @type {?} */
        DecoratedArgs.prototype.body;
    }
    /**
     * Class decorated with \@SynapseApi
     * @record
     */
    function SynapseApiClass() { }
    SynapseApiReflect.SynapseApiClass = SynapseApiClass;
    function SynapseApiClass_tsickle_Closure_declarations() {
    }
    /**
     * @param {?} classPrototype
     * @param {?} conf
     * @return {?}
     */
    function init(classPrototype, conf) {
        assert(classPrototype);
        // inherits config from parent annotation
        conf = _inheritConf(classPrototype, cloneDeep(conf));
        // retrieve global config
        const /** @type {?} */ globalConf = Synapse.getConfig();
        // patch it with local @SynapseApi config.
        const /** @type {?} */ conf_ = mergeConfigs({}, /** @type {?} */ (conf), globalConf, {
            path: ''
        });
        Object.freeze(conf_);
        // save conf for this class.
        Reflect.defineMetadata(CONF_KEY, conf_, classPrototype);
    }
    SynapseApiReflect.init = init;
    /**
     * @param {?} classPrototype
     * @return {?}
     */
    function getConf(classPrototype) {
        assert(classPrototype);
        if (!hasConf(classPrototype)) {
            throw new StateError(`no configuration found for class ${classPrototype.constructor.name}.
      Are you sure that this type is properly decorated with "@SynapseApi" ?`);
        }
        return cloneDeep(Reflect.getOwnMetadata(CONF_KEY, classPrototype));
    }
    SynapseApiReflect.getConf = getConf;
    /**
     * @param {?} classPrototype
     * @return {?}
     */
    function hasConf(classPrototype) {
        assert(classPrototype);
        return !!Reflect.getOwnMetadata(CONF_KEY, classPrototype);
    }
    SynapseApiReflect.hasConf = hasConf;
    /**
     * @return {?}
     */
    function addPathParamArg() {
        return (target, key, parameterIndex) => {
            _assertDecorateParameter('@PathParams', key, parameterIndex);
            const /** @type {?} */ decoratedArgs = getDecoratedArgs(target, key);
            decoratedArgs.path.push(/** @type {?} */ (parameterIndex));
            // decorators seems to process argument not always in natural order.
            decoratedArgs.path.sort();
        };
    }
    SynapseApiReflect.addPathParamArg = addPathParamArg;
    /**
     * @return {?}
     */
    function addQueryParamsArg() {
        return (target, key, parameterIndex) => {
            _assertDecorateParameter('@QueryParams', key, parameterIndex);
            getDecoratedArgs(target, key).query.push(parameterIndex);
        };
    }
    SynapseApiReflect.addQueryParamsArg = addQueryParamsArg;
    /**
     * @return {?}
     */
    function addHeadersArg() {
        return (target, key, parameterIndex) => {
            _assertDecorateParameter('@Headers', key, parameterIndex);
            getDecoratedArgs(target, key).headers.push(parameterIndex);
        };
    }
    SynapseApiReflect.addHeadersArg = addHeadersArg;
    /**
     * @param {?} params
     * @return {?}
     */
    function addBodyArg(params) {
        return (target, key, parameterIndex) => {
            const /** @type {?} */ args = getDecoratedArgs(target, key);
            if (args.body) {
                throw new TypeError('Can specify only one @Body parameter per method.');
            }
            getDecoratedArgs(target, key).body = {
                index: parameterIndex,
                params
            };
        };
    }
    SynapseApiReflect.addBodyArg = addBodyArg;
    /**
     * @param {?} target
     * @param {?} key
     * @return {?}
     */
    function getDecoratedArgs(target, key) {
        let /** @type {?} */ args = Reflect.getOwnMetadata(DECORATED_PARAMETERS_KEY, target, key);
        if (!args) {
            args = new DecoratedArgs();
            Reflect.defineMetadata(DECORATED_PARAMETERS_KEY, args, target, key);
        }
        return args;
    }
    SynapseApiReflect.getDecoratedArgs = getDecoratedArgs;
    /**
     * @return {?}
     */
    function addHandler() {
        // TODO
        throw new Error('not implemented');
    }
    SynapseApiReflect.addHandler = addHandler;
})(SynapseApiReflect || (SynapseApiReflect = {}));
/**
 * @param {?} classPrototype
 * @param {?} conf
 * @return {?}
 */
function _inheritConf(classPrototype, conf) {
    const /** @type {?} */ parentCtor = Object.getPrototypeOf(classPrototype).constructor;
    // if parent constructor is not 'Object'
    if (parentCtor.name !== 'Object') {
        const /** @type {?} */ parentConf = Reflect.getOwnMetadata(CONF_KEY, parentCtor.prototype);
        const /** @type {?} */ path = (conf.path && conf.path !== '') ? conf.path : parentConf.path;
        conf = mergeConfigs({ path }, conf, parentConf);
    }
    return conf;
}
/**
 * @param {?} decorator
 * @param {?} key
 * @param {?} parameterIndex
 * @return {?}
 */
function _assertDecorateParameter(decorator, key, parameterIndex) {
    if (!isNumber(parameterIndex)) {
        throw new SynapseError(`${decorator} should decorate parameters only. (Found @Header on function ${key}})`);
    }
}
//# sourceMappingURL=synapse-api.reflect.js.map