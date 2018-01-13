import { ResponseContentTypeConverter } from './response-converter-store';
export declare class JsonConverter implements ResponseContentTypeConverter<Object> {
    private static readonly SUPPORTED_CONTENT_TYPES;
    convert(response: Response): Promise<Object>;
    static accept(response: Response): boolean;
}
