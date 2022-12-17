import { StatusCodes } from '../constants/StatusCodes';

export class ServerError extends Error {
    public readonly status: keyof typeof StatusCodes;
    public readonly details?: string;
    public readonly headers?: Record<string, string>;

    public constructor(
        code: keyof typeof StatusCodes,
        details?: string,
        headers?: Record<string, string>
    ) {
        super(StatusCodes[code]);

        this.status = code;
        this.details = details;
        this.headers = headers;
    }

    public toJSON() {
        return {
            status: this.status,
            message: this.message,
            details: this.details,
        };
    }
}
