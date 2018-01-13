import { MapperType } from '../mapper.type';
import { ContentTypeConstants } from '../constants';
/**
 * Use this decorator on a parameter to specify that it should be considered as a path parameter.
 * The mapped parameter should be either a string, a number or a boolean. Any other type will throw an error.
 *
 * @returns
 */
export declare function PathParam(): ParameterDecorator;
/**
 * Use this decorator on a parameter to specify that it should be considered as a query parameter.
 * @returns
 */
export declare function QueryParams(): ParameterDecorator;
/**
 * Use this decorator on a parameter to specify that it should be considered as a header.
 * The given headers will be merged with any specified global header.
 * If you use multiple {@code Headers} decorators for a method, header will be merged as well.
 * @returns
 */
export declare const Headers: (() => ParameterDecorator) & {
    CONTENT_TYPE: string;
};
/**
 * Use this decorator on a parameter to specify that it should be considered as a body. Can be used once at most per method.
 * @returns
 */
export declare const Body: ((params?: ContentTypeConstants | BodyParams) => ParameterDecorator) & {
    ContentType: typeof ContentTypeConstants;
};
export interface BodyParams {
    contentType?: ContentTypeConstants;
    mapper?: MapperType<Object, any>;
}
