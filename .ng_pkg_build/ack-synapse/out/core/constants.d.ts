export declare enum ContentTypeConstants {
    FORM_DATA = "form-data",
    X_WWW_URL_ENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    PLAIN_TEXT = "text/plain",
    JSON = "application/json",
    JAVASCRIPT = "application/javascript",
}
export declare const HeaderConstants: {
    CONTENT_TYPE: string;
};
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}
export declare type HttpRequestHandler = (request: Request) => void;
export declare type HttpResponseHandler = (response: Response) => void;
/**
 * What element of the response should the API return?
 */
export declare enum ObserveType {
    RESPONSE = "response",
    BODY = "body",
}
