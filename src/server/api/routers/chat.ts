import { z } from 'zod'
import type { PrismaJson } from '../../../types/json'
import { createRouter, authedProcedure } from '../trpc'
import { jsonSchema } from '../../../schemas/json'
import { clerkClient } from '@clerk/nextjs/server'

export const chatRouter = createRouter({
  create: authedProcedure
    .input(
      z.object({
        content: jsonSchema,
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.auth.userId
      const receiverId = input.receiverId

      // Check if a chat channel already exists between the author and receiver
      const existingChannel = await ctx.prisma.channel.findFirst({
        where: {
          type: 'Chat',
          members: {
            every: {
              OR: [
                {
                  id: authorId,
                },
                {
                  id: receiverId,
                },
              ],
            },
          },
        },
      })

      const author = await clerkClient.users.getUser(authorId)
      const receiver = await clerkClient.users.getUser(receiverId)

      const createdSqueal = await ctx.prisma.squeal.create({
        data: {
          content: input.content as PrismaJson,
          author: { connect: { id: ctx.auth.userId } },
          channel: {
            connectOrCreate: {
              where: { id: existingChannel?.id || '' },
              create: {
                name: `Chat between @${author.username} and @${receiver.username}`,
                type: 'Chat',
                owner: { connect: { id: authorId } },
                members: {
                  connect: [{ id: authorId }, { id: receiverId }],
                },
              },
            },
          },
        },
      })

      return createdSqueal
    }),
  getAllChats: authedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId
    const chats = await ctx.prisma.channel.findMany({
      where: {
        type: 'Chat',
        members: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        members: true,
        _count: {
          select: { squeals: true },
        },
      },
    })

    // update the chats members with their pfp
    const updatedChats = await Promise.all(
      chats.map(async (chat) => {
        const updatedMembers = await Promise.all(
          chat.members.map(async (member) => {
            // Retrieve additional data from clerkClient based on the member's ID
            const userData = await clerkClient.users.getUser(member.id)
            const { profileImageUrl } = userData
            // Return the updated member object with additional data
            return {
              ...member,
              profileImageUrl,
            }
          })
        )
        // Return the updated chat object with updated members
        return {
          ...chat,
          members: updatedMembers,
        }
      })
    )

    return updatedChats
  }),
  getChat: authedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const squeals = await ctx.prisma.squeal.findMany({
        where: {
          channel: {
            id: input.chatId,
          },
        },
      })

      return squeals
    }),
})
