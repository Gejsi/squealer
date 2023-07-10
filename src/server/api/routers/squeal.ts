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
          replies: true,
          reactions: true,
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

      const enrichedReplies = await Promise.all(
        squeal.replies.map(async (reply) => {
          const replyAuthor = await clerkClient.users.getUser(reply.authorId)

          return {
            ...reply,
            author: {
              username: replyAuthor.username,
              profileImageUrl: replyAuthor.profileImageUrl,
            },
          }
        })
      )

      // increment squeal impressions
      await ctx.prisma.squeal.update({
        where: { id: input.squealId },
        data: { impressions: squeal.impressions + 1 },
      })

      const userReaction = await ctx.prisma.reaction.findUnique({
        where: {
          userId_squealId: {
            userId: ctx.auth.userId,
            squealId: input.squealId,
          },
        },
      })

      return {
        ...squeal,
        author: {
          username,
          profileImageUrl,
        },
        replies: enrichedReplies,
        reactions: {
          ...squeal.reactions,
          likes: squeal.reactions.filter((r) => r.type === 'Like').length,
          dislikes: squeal.reactions.filter((r) => r.type === 'Dislike').length,
          userReaction: userReaction?.type,
        },
      }
    }),

  create: protectedProcedure
    .input(z.object({ channelId: z.string().cuid(), content: jsonSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.squeal.create({
        data: {
          content: input.content as PrismaJson,
          author: { connect: { id: ctx.auth.userId } },
          channel: { connect: { id: input.channelId } },
        },
      })
    }),

  reply: protectedProcedure
    .input(
      z.object({
        channelId: z.string().cuid(),
        squealId: z.string().cuid(),
        content: jsonSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const parentSqueal = await ctx.prisma.squeal.findUnique({
        where: { id: input.squealId },
      })

      if (!parentSqueal)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "This squeal doesn't exist.",
        })

      const reply = await ctx.prisma.squeal.create({
        data: {
          content: input.content as PrismaJson,
          author: { connect: { id: ctx.auth.userId } },
          channel: { connect: { id: input.channelId } },
          parentSqueal: { connect: { id: input.squealId } },
        },
      })

      return reply
    }),

  react: protectedProcedure
    .input(
      z.object({
        channelId: z.string().cuid(),
        squealId: z.string().cuid(),
        type: z.enum(['Like', 'Dislike']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.reaction.upsert({
        where: {
          userId_squealId: {
            userId: ctx.auth.userId,
            squealId: input.squealId,
          },
        },
        create: {
          type: input.type,
          squeal: { connect: { id: input.squealId } },
          user: { connect: { id: ctx.auth.userId } },
        },
        update: {
          type: input.type,
        },
      })
    }),
})
