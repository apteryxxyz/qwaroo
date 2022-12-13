import type { ServerError } from './ServerError';
import { StatusCodes } from './StatusCodes';

export class ClientError extends Error {
    public readonly status: number;
    public readonly details?: string;
    public readonly headers?: Record<string, string>;

    public constructor(code: number, details?: string) {
        super(StatusCodes[code as unknown as keyof typeof StatusCodes]);

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
