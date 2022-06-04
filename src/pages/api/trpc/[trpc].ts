import { createContext } from '@/server/context';
import { createRouter } from '@/server/createRouter';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

export const appRouter = createRouter()
  .query('next-auth.getSession', {
    async resolve({ ctx }) {
      return ctx.session;
    },
  })
  .mutation('addTime', {
    input: z.object({ time: z.number() }),
    async resolve({ input, ctx }) {
      await ctx.prisma.time.create({
        data: {
          time: input.time,
        },
      });
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
