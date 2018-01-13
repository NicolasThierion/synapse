import { ContentTypeConstants } from '../../../constants';
export interface ResponseContentTypeConverter<T> {
    convert(response: Response): Promise<T>;
}
export declare class ResponseContentTypeConverterStore {
    private static converters;
    static addConverter(converter: ResponseContentTypeConverter<any>, contentType: ContentTypeConstants | string): void;
    static getConverterFor(contentType: ContentTypeConstants): ResponseContentTypeConverter<any>;
}
