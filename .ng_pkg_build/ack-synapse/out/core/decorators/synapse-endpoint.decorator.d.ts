import { HttpBackendAdapter } from '../http-backend';
import { EndpointConfig } from '../endpoint-config.type';
/**
 * Parameters decorated with @Headers are considered to be of this type.
 */
export interface HeadersType {
    [k: string]: string | string[];
}
/**
 * Parameters decorated with @PathParam are considered to be of this type.
 */
export declare type PathParamsType = string | number | boolean;
/**
 * Parameters decorated with @QueryParams are considered to be of this type.
 */
export declare type QueryParametersType = Object;
/**
 * GET method decorator.
 *
 * @param {EndpointConfig | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the GET decorator
 */
export declare function GET(conf?: EndpointConfig | string): MethodDecorator;
/**
 * POST method decorator.
 *
 * @param {EndpointConfig | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the POST decorator
 */
export declare function POST(conf?: EndpointConfig | string): MethodDecorator;
/**
 * PUT method decorator.
 *
 * @param {EndpointConfig | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the PUT decorator
 */
export declare function PUT(conf?: EndpointConfig | string): MethodDecorator;
/**
 * PATCH method decorator.
 *
 * @param {EndpointConfig | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the PATCH decorator
 */
export declare function PATCH(conf?: EndpointConfig | string): MethodDecorator;
/**
 * DELETE method decorator.
 *
 * @param {EndpointConfig | string} conf the configuration for this endpoint
 * @returns {MethodDecorator} the DELETE decorator
 */
export declare function DELETE(conf?: EndpointConfig | string): MethodDecorator;
/**
 * Ensure the given object is a Response. We consider that any httpBackendAdapter should return a Promise<Response>,
 * This function asserts that this is true.
 *
 */
export declare function _assertIsResponsePromise(http: HttpBackendAdapter, method: string, object: any): Promise<Response>;
