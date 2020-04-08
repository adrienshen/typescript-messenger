export default class ResponseError extends Error {
    name: string;
    statusCode: number;

    constructor(message: string, name?: string, code?: number) {
        super(message);
        this.name = name || "ResponseError";
        this.statusCode = code || 503;
    }
}