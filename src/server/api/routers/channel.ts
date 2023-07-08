import { clerkClient } from '@clerk/nextjs/server'
import { authedProcedure, createRouter, premiumProcedure } from '../trpc'
import { z } from 'zod'

export const channelRouter = createRouter({
  getAllChannels: authedProcedure.query(async ({ ctx }) => {
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

  create: premiumProcedure
    .input(
      z.object({
        name: z.string().max(100, {
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
        },
      })

      return channel
    }),
})
