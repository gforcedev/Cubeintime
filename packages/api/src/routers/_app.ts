/**
 * This file contains the root router of your tRPC-backend
 */
import z from 'zod';
import { createRouter } from '../createRouter';
import { Penalty, Time } from '@prisma/client';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
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
  })
  .query('hello', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input }) {
      return `Hello, ${input.name}`;
    },
  });

export type AppRouter = typeof appRouter;
