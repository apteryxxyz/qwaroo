import process from 'node:process';
import { ServerError as Error } from '@owenii/common';
import cors from 'cors';
import type { Response } from 'express';
import express from 'express';
import { useRateLimiter } from './middleware/useRateLimiter';

export class Server {
    public app: express.Application;
    public port: number;

    public constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    /** Make the server listen. */
    public async listen() {
        this.app.use(cors({ origin: process.env['WEB_URL']! }));
        this.app.use(useRateLimiter());

        this.app.use(require('./routes/auth').default());
        this.app.use(require('./routes/games').default());
        this.app.use(require('./routes/scores').default());
        this.app.use(require('./routes/users').default());

        this.app.use((_req, res) => {
            res.status(404).json({
                success: false,
                ...new Error(404).toJSON(),
            });
        });

        this.app.use(
            (error: Error, _req: unknown, res: Response, _next: unknown) => {
                console.error(error);
                const apiError =
                    error instanceof Error ? error : new Error(500);
                res.status(apiError.status).json({
                    success: false,
                    ...apiError.toJSON(),
                });
            }
        );

        void this.app.listen(this.port);
        console.info(`Listening on port ${this.port}`);
    }
}
