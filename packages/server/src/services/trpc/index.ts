import { initTRPC, TRPCError } from '@trpc/server';
import { TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import type { createContext } from './context';

export const t = initTRPC.context<ReturnType<typeof createContext>>().create({
  transformer: SuperJSON,
  errorFormatter(options) {
    while (options.error.cause?.cause)
      Reflect.set(options.error, 'cause', options.error.cause.cause);

    if (options.error.cause instanceof ZodError) {
      const error = fromZodError(options.error.cause, {
        prefix: '',
        prefixSeparator: '',
      });

      return {
        code: TRPC_ERROR_CODES_BY_KEY.BAD_REQUEST,
        message: error.message,
        data: {
          code: 'BAD_REQUEST',
          httpStatus: 400,
          path: options.path,
          details: error.details,
        },
      };
    }

    return options.shape;
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.me) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx } });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(isAuthed);
