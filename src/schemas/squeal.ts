import { z } from 'zod'
import type { JsonValue } from '../types/json'

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])

const jsonSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
)

export const squealSchema = z.object({
  content: jsonSchema,
  receiverId: z.string(),
})
