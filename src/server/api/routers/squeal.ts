import { squealSchema } from '../../../schemas/squeal'
import type { PrismaJson } from '../../../types/json'
import { createRouter, authedProcedure } from '../trpc'

export const squealRouter = createRouter({
  create: authedProcedure
    .input(squealSchema)
    .mutation(async ({ ctx, input }) => {
      const createdSqueal = await ctx.prisma.squeal.create({
        data: {
          content: input.content as PrismaJson,
          author: { connect: { id: ctx.auth.userId } },
          receiver: {
            connectOrCreate: {
              where: { id: input.receiverId },
              create: {
                type: 'User',
                user: { connect: { id: input.receiverId } },
              },
            },
          },
        },
      })

      return createdSqueal
    }),
})
