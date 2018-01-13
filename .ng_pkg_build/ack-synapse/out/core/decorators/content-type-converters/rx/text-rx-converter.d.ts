import { ResponseContentTypeConverter } from './response-converter-store';
export declare class TextConverter implements ResponseContentTypeConverter<string> {
    private static readonly SUPPORTED_CONTENT_TYPES;
    convert(response: Response): Promise<string>;
    static accept(response: Response): boolean;
}
