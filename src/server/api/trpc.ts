import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { getAuth } from '@clerk/nextjs/server'
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/api'

import { prisma } from '../db'

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 */
const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    auth,
    prisma,
  }
}

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({ auth: getAuth(opts.req) })
}

/**
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
