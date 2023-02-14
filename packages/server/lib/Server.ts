import { ServerError as Error } from '@qwaroo/common';
import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';

export class Server {
    public app: express.Application;
    public routers: express.Router[] = [];

    public constructor() {
        this.app = express();

        this.app.use(cors({ origin: '*' }));

        this.app.locals['onError'] = (
            err: Error,
            _req: Request,
            res: Response
        ) =>
            res.status(err.status).json({
                success: false,
                ...err.toJSON(),
            });
    }

    public setOnError(
        onError: (err: Error, req: Request, res: Response) => void
    ) {
        this.app.locals['onError'] = onError;
    }

    /** Start the server. */
    public async listen(port: number) {
        for (const router of this.routers) {
            this.app.use(router);
        }

        this.app.use((req, res) =>
            this.app.locals['onError'](new Error(404), req, res)
        );
        this.app.use(
            (err: Error, req: Request, res: Response, _next: NextFunction) => {
                const error = err instanceof Error ? err : new Error(500);
                if (err.status === 500) console.error(error);
                if (error.headers) res.set(error.headers);
                this.app.locals['onError'](error, req, res);
            }
        );

        void this.app.listen(port);
        console.info(`Listening on port ${port}`);
    }
}
