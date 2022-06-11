import { createContext } from '@/server/context';
import { createRouter } from '@/server/createRouter';
import { Time, Penalty } from '@prisma/client';
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
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        });
      }

      return times;
    },
  })
  .mutation('addTime', {
    input: z.object({ time: z.number(), scramble: z.string() }),
    async resolve({ input, ctx }) {
      if (ctx.session?.user.id) {
        await ctx.prisma.time.create({
          data: {
            time: input.time,
            scramble: input.scramble,
            userId: ctx.session?.user?.id,
          },
        });
      }
    },
  })
  .mutation('deleteTime', {
    input: z.object({ id: z.number() }),
    async resolve({ input, ctx }) {
      if (ctx.session?.user.id) {
        const timeToDelete = await ctx.prisma.time.findFirst({
          where: { id: { equals: input.id } },
        });
        if (timeToDelete?.userId === ctx.session?.user.id) {
          await ctx.prisma.time.delete({ where: { id: input.id } });
        }
      }
    },
  })
  .mutation('penaltyTime', {
    input: z.object({
      id: z.number(),
      penalty: z.nativeEnum(Penalty).nullable(),
    }),
    async resolve({ input, ctx }) {
      if (ctx.session?.user.id) {
        const timeToDelete = await ctx.prisma.time.findFirst({
          where: { id: { equals: input.id } },
        });
        if (timeToDelete?.userId === ctx.session?.user.id) {
          await ctx.prisma.time.update({
            where: { id: input.id },
            data: { penalty: input.penalty },
          });
        }
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
