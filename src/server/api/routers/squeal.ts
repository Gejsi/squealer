import { z } from 'zod'
import { squealSchema } from '../../../schemas/squeal'
import type { PrismaJson } from '../../../types/json'
import { createRouter, authedProcedure } from '../trpc'

export const squealRouter = createRouter({
  create: authedProcedure
    .input(squealSchema) // NOTE: maybe squealSchema should moved inside this file
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
  getPersonalChats: authedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.squeal.findMany({
      where: {
        OR: [
          {
            author: {
              id: ctx.auth.userId,
            },
          },
          {
            receiver: {
              userId: ctx.auth.userId,
            },
          },
        ],
      },
      distinct: ['receiverId'],
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),
  getChat: authedProcedure
    .input(z.object({ receiverId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.squeal.findMany({
        where: {
          OR: [
            {
              author: {
                id: ctx.auth.userId,
              },
              receiver: {
                userId: input.receiverId,
              },
            },
            {
              author: {
                id: input.receiverId,
              },
              receiver: {
                userId: ctx.auth.userId,
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),
})
