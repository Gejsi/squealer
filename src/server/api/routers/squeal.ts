import { z } from 'zod'
import type { PrismaJson } from '../../../types/json'
import { createRouter, protectedProcedure, publicProcedure } from '../trpc'
import { jsonSchema } from '../../../schemas/json'
import { TRPCError } from '@trpc/server'
import { clerkClient } from '@clerk/nextjs/server'
import { enrichSqueals } from '../../../utils/api'
import { shuffleArray } from '../../../utils/misc'
import { ADMIN_ID } from './auto'

const SINGULARITY = 2

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
        properties: {
          likesCount: squeal.reactions.filter((r) => r.type === 'Like').length,
          dislikesCount: squeal.reactions.filter((r) => r.type === 'Dislike')
            .length,
          userReactionType: userReaction?.type,
        },
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        channelId: z.string().cuid(),
        content: jsonSchema,
        contentLength: z.number().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const squeal = await ctx.prisma.squeal.create({
        data: {
          content: input.content as PrismaJson,
          author: { connect: { id: ctx.auth.userId } },
          channel: { connect: { id: input.channelId } },
        },
      })

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.auth.userId },
      })

      if (input.contentLength && user) {
        await ctx.prisma.user.update({
          where: { id: ctx.auth.userId },
          data: {
            quota: user.quota + input.contentLength,
            dailyQuotaLimit: user.dailyQuotaLimit - input.contentLength,
            weeklyQuotaLimit: user.weeklyQuotaLimit - input.contentLength,
            monthlyQuotaLimit: user.monthlyQuotaLimit - input.contentLength,
          },
        })
      }

      return squeal
    }),

  reply: protectedProcedure
    .input(
      z.object({
        channelId: z.string().cuid(),
        squealId: z.string().cuid(),
        content: jsonSchema,
        contentLength: z.number().nullish(),
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

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.auth.userId },
      })

      if (input.contentLength && user) {
        await ctx.prisma.user.update({
          where: { id: ctx.auth.userId },
          data: {
            quota: user.quota + input.contentLength,
            dailyQuotaLimit: user.dailyQuotaLimit - input.contentLength,
            weeklyQuotaLimit: user.weeklyQuotaLimit - input.contentLength,
            monthlyQuotaLimit: user.monthlyQuotaLimit - input.contentLength,
          },
        })
      }

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
      const reaction = await ctx.prisma.reaction.upsert({
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

      const squeal = await ctx.prisma.squeal.findUnique({
        where: { id: input.squealId },
        select: {
          reactions: true,
          authorId: true,
        },
      })

      if (squeal) {
        const likes = squeal.reactions.filter((r) => r.type === 'Like').length
        const dislikes = squeal.reactions.filter(
          (r) => r.type === 'Dislike'
        ).length

        if (likes >= SINGULARITY && dislikes >= SINGULARITY) {
          await ctx.prisma.squeal.update({
            where: { id: input.squealId },
            data: { intensity: 'Controversial' },
          })
        } else if (likes >= SINGULARITY) {
          await ctx.prisma.squeal.update({
            where: { id: input.squealId },
            data: { intensity: 'Popular' },
          })

          await ctx.prisma.user.update({
            where: { id: squeal.authorId },
            data: {
              quota: { decrement: 100 },
            },
          })
        } else if (dislikes >= SINGULARITY) {
          await ctx.prisma.squeal.update({
            where: { id: input.squealId },
            data: { intensity: 'Unpopular' },
          })

          await ctx.prisma.user.update({
            where: { id: squeal.authorId },
            data: {
              quota: { increment: 100 },
            },
          })
        }
      }

      return reaction
    }),

  getControversials: publicProcedure.query(async ({ ctx }) => {
    const squeals = await ctx.prisma.squeal.findMany({
      where: { intensity: 'Controversial' },
      orderBy: { createdAt: 'desc' },
    })

    return await enrichSqueals(squeals)
  }),

  getPopular: publicProcedure.query(async ({ ctx }) => {
    const squeals = await ctx.prisma.squeal.findMany({
      where: { intensity: 'Popular' },
      orderBy: { createdAt: 'desc' },
    })

    return await enrichSqueals(squeals)
  }),

  getUnpopular: publicProcedure.query(async ({ ctx }) => {
    const squeals = await ctx.prisma.squeal.findMany({
      where: { intensity: 'Unpopular' },
      orderBy: { createdAt: 'desc' },
    })

    return await enrichSqueals(squeals)
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const squeals = await ctx.prisma.squeal.findMany({
      where: {
        channel: { type: 'Channel' },
        parentSquealId: null,
        author: { NOT: { id: ADMIN_ID } },
      },
      orderBy: { createdAt: 'desc' },
      include: { channel: { select: { name: true } } },
    })

    shuffleArray(squeals)

    return (await enrichSqueals(squeals)) as typeof squeals &
      Awaited<ReturnType<typeof enrichSqueals>>
  }),
})
