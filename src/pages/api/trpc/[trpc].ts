import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

const prisma = new PrismaClient();

export const appRouter = trpc.router().mutation('addTime', {
  input: z.object({ time: z.number() }),
  async resolve({ input }) {
    console.log('resolving');
    await prisma.time.create({
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
  createContext: () => null,
});
