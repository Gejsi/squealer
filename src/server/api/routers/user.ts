import {
  createRouter,
  authedProcedure,
  publicProcedure,
  premiumProcedure,
} from '../trpc'
import {
  type UserMetadata,
  userMetadataSchema,
} from '../../../schemas/user-metadata'
import { Prisma } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { shuffleArray } from '../../../utils/misc'
import { ADMIN_ID } from './auto'
import { enrichSqueals } from '../../../utils/api'

const commonSelector = Prisma.validator<Prisma.UserSelect>()({
  role: true,
  quota: true,
  dailyQuotaLimit: true,
  weeklyQuotaLimit: true,
  monthlyQuotaLimit: true,
})

export const userRouter = createRouter({
  upsert: authedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.upsert({
      where: { id: ctx.auth.userId },
      update: {},
      create: { id: ctx.auth.userId },
      select: commonSelector,
    })

    // makes the premium middleware work without re-fetching the current user
    await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
      privateMetadata: { role: user.role },
    })

    return user as UserMetadata
  }),

  getMetadata: authedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId },
      select: commonSelector,
    })

    return user as UserMetadata
  }),

  updateMetadata: authedProcedure
    .input(userMetadataSchema)
    .mutation(async ({ ctx, input }) => {
      const userMetadata = await ctx.prisma.user.update({
        where: { id: ctx.auth.userId },
        data: {
          role: input.role,
          quota: input.quota,
          dailyQuotaLimit: input.dailyQuotaLimit,
          weeklyQuotaLimit: input.weeklyQuotaLimit,
          monthlyQuotaLimit: input.monthlyQuotaLimit,
        },
        select: commonSelector,
      })

      // makes the premium middleware work without re-fetching the current user
      await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
        privateMetadata: { role: input.role },
      })

      return userMetadata
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const dbUsers = await ctx.prisma.user.findMany({
      where: { NOT: { id: ADMIN_ID } },
    })
    const clerkUsers = await clerkClient.users.getUserList()

    // merge the info from the database with the info from clerk
    const mergedUsers = dbUsers.map((dbUser) => {
      const clerkUser = clerkUsers.find((user) => user.id === dbUser.id)

      return { ...dbUser, ...clerkUser }
    })

    return mergedUsers
  }),

  getAllRandom: authedProcedure.query(async () => {
    const clerkUsers = await clerkClient.users.getUserList()
    shuffleArray(clerkUsers)
    return clerkUsers
      .map((user) => user.username)
      .filter((username): username is string => !!username)
  }),

  get: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const clerkUser = (
        await clerkClient.users.getUserList({ username: [input.username] })
      )[0]

      if (!clerkUser)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found.',
        })

      const user = await ctx.prisma.user.findUnique({
        where: { id: clerkUser?.id },
        include: {
          squeals: true,
          _count: {
            select: { squeals: true, reactions: true },
          },
        },
      })

      const mergedUser = {
        ...clerkUser,
        ...user,
      }

      return mergedUser
    }),

  getFeed: authedProcedure.query(async ({ ctx }) => {
    const subChannels = await ctx.prisma.channel.findMany({
      where: { members: { some: { id: ctx.auth.userId } } },
      select: {
        squeals: {
          where: { NOT: { authorId: ctx.auth.userId } },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { channel: { select: { name: true } }, author: true },
        },
      },
    })

    const squeals: (typeof subChannels)[0]['squeals'] &
      Awaited<ReturnType<typeof enrichSqueals>> = []

    for (const channel of subChannels) {
      const enrichedSqueals = await enrichSqueals(channel.squeals)
      enrichedSqueals.map((s) => squeals.push(s))
    }

    shuffleArray(squeals)

    return squeals
  }),

  getStats: premiumProcedure.query(async ({ ctx }) => {
    const squeals = await ctx.prisma.squeal.findMany({
      where: { authorId: ctx.auth.userId, parentSquealId: null },
      include: {
        reactions: true,
        replies: true,
      },
    })

    let reactions = 0,
      replies = 0,
      impressions = 0,
      controversial = 0,
      popular = 0,
      unpopular = 0

    for (const squeal of squeals) {
      reactions += squeal.reactions.length
      replies += squeal.replies.length
      impressions += squeal.impressions

      if (squeal.intensity === 'Controversial') controversial++
      else if (squeal.intensity === 'Popular') popular++
      else if (squeal.intensity === 'Unpopular') unpopular++
    }

    return {
      total: squeals.length,
      reactions,
      replies,
      impressions,
      controversial,
      popular,
      unpopular,
    }
  }),
})
