import { clerkClient } from '@clerk/nextjs'
import { env } from '../../../env/server.mjs'
import type { PrismaJson } from '../../../types/json'
import { createRouter, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

const ADMIN_ID = 'user_2STlkJKHQpPKswIo57uD6KLUUyW'
const FACTS_CHANNEL_ID = 'cljzwly4i0000d2aa996z2qd7'

export const autoRouter = createRouter({
  createFactSqueal: publicProcedure.mutation(async ({ ctx }) => {
    const res = await fetch('https://api.api-ninjas.com/v1/facts', {
      headers: { 'X-Api-Key': env.NINJA_KEY },
    })
    const fact = (await res.json())[0].fact

    const jsonContent = {
      type: 'doc',
      content: [
        {
          type: 'text',
          text: fact,
        },
      ],
    }

    const squeal = await ctx.prisma.squeal.create({
      data: {
        content: jsonContent as PrismaJson,
        author: { connect: { id: ADMIN_ID } },
        channel: { connect: { id: FACTS_CHANNEL_ID } },
      },
    })

    return squeal
  }),

  getFactSqueals: publicProcedure.query(async ({ ctx }) => {
    const channel = await ctx.prisma.channel.findUnique({
      where: { id: FACTS_CHANNEL_ID },
      include: {
        squeals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!channel) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

    const enrichedSqueals = await Promise.all(
      channel.squeals.map(async (squeal) => {
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

    return enrichedSqueals
  }),
})
