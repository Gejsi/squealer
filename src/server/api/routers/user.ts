import { createRouter, authedProcedure } from '../trpc'
import {
  type UserMetadata,
  userMetadataSchema,
} from '../../../schemas/user-metadata'
import { Prisma } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'
import { ClerkUser, FullUser } from '../../../types/user'

const commonSelector = Prisma.validator<Prisma.UserSelect>()({
  role: true,
  quota: true,
  dailyQuotaLimit: true,
  weeklyQuotaLimit: true,
  monthlyQuotaLimit: true,
})

export const userRouter = createRouter({
  getMetadata: authedProcedure.query(async ({ ctx }) => {
    let userMetadata
    userMetadata = await ctx.prisma.user.findUnique({
      where: { id: ctx.auth.userId },
      select: commonSelector,
    })

    if (!userMetadata) {
      userMetadata = await ctx.prisma.user.create({
        data: { id: ctx.auth.userId },
      })
    }

    // makes the premium middleware work without re-fetching the current user
    await clerkClient.users.updateUserMetadata(ctx.auth.userId, {
      privateMetadata: { role: userMetadata.role },
    })

    return userMetadata as UserMetadata
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

      return userMetadata
    }),
  getAll: authedProcedure.query(async ({ ctx }) => {
    const dbUsers = await ctx.prisma.user.findMany()
    const clerkUsers = await clerkClient.users.getUserList()

    // merge the info from the database with the info from clerk
    const mergedUsers: FullUser[] = dbUsers.map((dbUser) => {
      const clerkUser = clerkUsers.find(
        (user) => user.id === dbUser.id
      ) as ClerkUser

      return { ...dbUser, ...clerkUser }
    })

    return mergedUsers
  }),
})
