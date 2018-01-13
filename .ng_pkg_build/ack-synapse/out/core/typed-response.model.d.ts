export declare class TypedResponse<T> {
    readonly body: T;
    readonly headers: Headers;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;
    readonly redirected: boolean;
    clone(): TypedResponse<T>;
    constructor(body?: T, init?: ResponseInit | Response);
}
