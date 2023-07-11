import { clerkClient } from '@clerk/nextjs/server'
import {
  authedProcedure,
  createRouter,
  premiumProcedure,
  protectedProcedure,
} from '../trpc'
import { z } from 'zod'
import { shuffleArray } from '../../../utils/misc'

export const channelRouter = createRouter({
  getAll: authedProcedure.query(async ({ ctx }) => {
    const channels = await ctx.prisma.channel.findMany({
      where: {
        type: 'Channel',
      },
      include: {
        members: true,
        _count: {
          select: { squeals: true, members: true },
        },
      },
    })

    const enrichedChannels = await Promise.all(
      channels.map(async (channel) => {
        const clerkUser = await clerkClient.users.getUser(channel.ownerId)

        const updatedMembers = await Promise.all(
          channel.members.map(async (member) => {
            const { profileImageUrl } = await clerkClient.users.getUser(
              member.id
            )

            return {
              ...member,
              profileImageUrl,
            }
          })
        )

        return {
          ...channel,
          members: updatedMembers,
          owner: {
            username: clerkUser.username,
          },
        }
      })
    )

    return enrichedChannels
  }),

  getSubscribedChannels: authedProcedure.query(async ({ ctx }) => {
    const channels = await ctx.prisma.channel.findMany({
      where: {
        type: 'Channel',
        OR: [
          {
            members: {
              some: {
                id: ctx.auth.userId,
              },
            },
          },
          {
            owner: { id: ctx.auth.userId },
          },
        ],
      },
      include: {
        owner: true,
      },
    })

    const enrichedChannels = await Promise.all(
      channels.map(async (channel) => {
        const clerkUser = await clerkClient.users.getUser(channel.ownerId)

        return {
          ...channel,
          owner: {
            profileImageUrl: clerkUser.profileImageUrl,
            username: clerkUser.username,
          },
        }
      })
    )

    return enrichedChannels
  }),

  getAllRandom: authedProcedure.query(async ({ ctx }) => {
    const channels = await ctx.prisma.channel.findMany({
      where: { type: 'Channel' },
      select: { name: true },
    })

    shuffleArray(channels)

    return channels.map((channel) => channel.name)
  }),

  create: premiumProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, {
            message: 'Channel name must be at least one character.',
          })
          .max(100, {
            message: 'Channel name must be less than 100 characters.',
          }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.prisma.channel.create({
        data: {
          name: input.name,
          type: 'Channel',
          owner: { connect: { id: ctx.auth.userId } },
          members: {
            connect: { id: ctx.auth.userId },
          },
        },
      })

      return channel
    }),

  get: protectedProcedure
    .input(z.object({ channelId: z.string().cuid() }))
    .query(async ({ ctx }) => {
      const clerkOwner = await clerkClient.users.getUser(ctx.channel.ownerId)

      const enrichedMembers = await Promise.all(
        ctx.channel.members.map(async (member) => {
          const { profileImageUrl } = await clerkClient.users.getUser(member.id)

          return {
            ...member,
            profileImageUrl,
          }
        })
      )

      const enrichedSqueals = await Promise.all(
        ctx.channel.squeals.map(async (squeal) => {
          const { profileImageUrl, username } = await clerkClient.users.getUser(
            squeal.authorId
          )

          return {
            ...squeal,
            author: {
              username,
              profileImageUrl,
            },
          }
        })
      )

      return {
        ...ctx.channel,
        squeals: enrichedSqueals,
        members: enrichedMembers,
        owner: clerkOwner,
      }
    }),

  join: authedProcedure
    .input(z.object({ channelId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.channel.update({
        where: { id: input.channelId },
        data: {
          members: {
            connect: { id: ctx.auth.userId },
          },
        },
      })
    }),
})
