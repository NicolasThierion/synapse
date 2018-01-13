import { ContentTypeConstants } from '../../../constants';
export interface RequestContentTypeConverter {
    convert(body: any, request: Request): Promise<Request>;
}
export declare class RequestConverterStore {
    private static converters;
    static addConverter(converter: RequestContentTypeConverter, contentType: ContentTypeConstants | string): void;
    static getConverterFor(contentType: ContentTypeConstants): RequestContentTypeConverter;
}
