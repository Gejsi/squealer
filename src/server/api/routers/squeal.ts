import { z } from 'zod'
import type { PrismaJson } from '../../../types/json'
import { createRouter, protectedProcedure } from '../trpc'
import { jsonSchema } from '../../../schemas/json'
import { TRPCError } from '@trpc/server'
import { clerkClient } from '@clerk/nextjs/server'

export const squealRouter = createRouter({
  getFromChannel: protectedProcedure
    .input(
      z.object({ channelId: z.string().cuid(), squealId: z.string().cuid() })
    )
    .query(async ({ ctx, input }) => {
      const squeal = await ctx.prisma.squeal.findUnique({
        where: { id: input.squealId },
        include: {
          channel: {
            select: { name: true },
          },
        },
      })

      if (!squeal)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "This squeal doesn't exist.",
        })

      const { username, profileImageUrl } = await clerkClient.users.getUser(
        squeal.authorId
      )

      return {
        ...squeal,
        author: {
          username,
          profileImageUrl,
        },
      }
    }),

  create: protectedProcedure
    .input(z.object({ channelId: z.string().cuid(), content: jsonSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.squeal.create({
        data: {
          content: input.content as PrismaJson,
          author: {
            connect: { id: ctx.auth.userId },
          },
          channel: {
            connect: { id: input.channelId },
          },
        },
      })
    }),
})
