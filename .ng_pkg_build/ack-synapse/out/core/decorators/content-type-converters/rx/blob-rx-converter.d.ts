import { ResponseContentTypeConverter } from './response-converter-store';
export declare class BlobConverter implements ResponseContentTypeConverter<Object> {
    convert(response: Response): Promise<Object>;
}
