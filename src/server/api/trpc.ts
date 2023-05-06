import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { clerkClient, getAuth } from '@clerk/nextjs/server'
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/api'
import { prisma } from '../db'
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject
}

declare global {
  interface UserPublicMetadata {
    role: 'regular' | 'premium'
    quota: number
    quotaLimit: number
  }
}

/**
 * This helper generates the "internals" for a tRPC context.
 */
const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    auth,
    prisma,
  }
}

/**
 * This is the actual context used in the router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const auth = getAuth(opts.req)

  const publicMetadata: UserPublicMetadata = (auth.sessionClaims as any)
    .public_metadata

  if (
    auth.userId &&
    (!('role' in publicMetadata) ||
      !('quota' in publicMetadata) ||
      !('quotaLimit' in publicMetadata))
  ) {
    // add 'regular' role by default for all users and a quota of characters
    clerkClient.users.updateUserMetadata(auth.userId, {
      publicMetadata: { role: 'regular', quota: 500, quotaLimit: 500 },
    })
  }

  return createInnerTRPCContext({ auth })
}

/**
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId || !ctx.auth.user)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only authenticated users can access this feature.',
    })

  return next({
    ctx: {
      ...ctx,
      // infers that `user` is non-nullable to downstream resolvers
      auth: { ...ctx.auth, user: ctx.auth.user },
    },
  })
})

const isPremium = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId || !ctx.auth.user)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only authenticated users can access this feature.',
    })

  if (ctx.auth.user.publicMetadata.role !== 'premium')
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only premium users can access this feature.',
    })

  return next({
    ctx: {
      ...ctx,
      auth: { ...ctx.auth, user: ctx.auth.user },
    },
  })
})

export const createRouter = t.router
export const publicProcedure = t.procedure
export const authedProcedure = publicProcedure.use(isAuthed)
export const premiumProcedure = authedProcedure.use(isPremium)
