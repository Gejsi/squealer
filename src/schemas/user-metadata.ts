import { z } from 'zod'

export const userMetadataSchema = z
  .object({
    role: z.enum(['regular', 'premium'], {
      errorMap: () => ({ message: 'User can be either regular or premium.' }),
    }),
    quota: z.number().int().min(0).max(1000),
    quotaLimit: z.number().int().min(0).max(1000),
  })
  .refine((schema) => schema.quotaLimit >= schema.quota, {
    message: 'The quota limit must be greater than the currently used quota.',
    path: ['quotaLimit'],
  })

type Metadata = z.infer<typeof userMetadataSchema>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface UserPublicMetadata extends Metadata {}
}
