import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/api'
import { getAuth } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { prisma } from '../db'

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject
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
  return createInnerTRPCContext({ auth })
}

/**
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only authenticated users can access this feature.',
    })

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  })
})

const isPremium = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only authenticated users can access this feature.',
    })

  if (ctx.auth.user && ctx.auth.user.publicMetadata.role !== 'premium')
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only premium users can access this feature.',
    })

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  })
})

export const createRouter = t.router
export const publicProcedure = t.procedure
export const authedProcedure = publicProcedure.use(isAuthed)
export const premiumProcedure = authedProcedure.use(isPremium)
