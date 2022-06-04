import { createContext } from '@/server/context';
import { createRouter } from '@/server/createRouter';
import { prisma, Time } from '@prisma/client';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

export const appRouter = createRouter()
  .query('next-auth.getSession', {
    async resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query('getUserTimes', {
    async resolve({ ctx }) {
      let times: Time[] = [];

      if (ctx.session?.user?.id) {
        times = await ctx.prisma.time.findMany({
          where: {
            userId: {
              equals: ctx.session.user.id,
            },
          },
        });
      }

      return times;
    },
  })
  .mutation('addTime', {
    input: z.object({ time: z.number() }),
    async resolve({ input, ctx }) {
      if (ctx.session?.user.id) {
        await ctx.prisma.time.create({
          data: {
            time: input.time,
            userId: ctx.session?.user?.id,
          },
        });
      }
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
