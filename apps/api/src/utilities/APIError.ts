import { STATUS_CODES } from 'node:http';

export class APIError extends Error {
    public readonly status: number;
    public readonly details?: string;
    public readonly headers?: Record<string, string>;

    public constructor(
        code: number,
        details?: string,
        headers?: Record<string, string>
    ) {
        super(STATUS_CODES[code]);

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
