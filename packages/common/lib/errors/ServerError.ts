import { StatusCodes } from '../constants/StatusCodes';

/**
 * A error that is to be throw from within the server.
 * These are caught are sent back to the client.
 * Any other error will be caught and sent as a 500 error.
 */
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
