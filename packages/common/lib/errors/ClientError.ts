import { StatusCodes } from '../constants/StatusCodes';
import type { ServerError } from './ServerError';

/**
 * Basically the same as ServerError, but is to be thrown from the client.
 */
export class ClientError extends Error {
    public readonly status: keyof typeof StatusCodes;
    public readonly details?: string;

    public constructor(code: keyof typeof StatusCodes, details?: string) {
        super(StatusCodes[code]);

        this.status = code;
        this.details = details;
    }

    public toJSON() {
        return {
            status: this.status,
            message: this.message,
            details: this.details,
        };
    }

    public static fromServer(error: ReturnType<ServerError['toJSON']>) {
        return new ClientError(error.status, error.details);
    }
}
