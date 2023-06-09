/**
 * Utility types from
 * @link https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
 */

import type { Prisma } from '@prisma/client'

/**
Matches a JSON object.
This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.
*/
export type JsonObject = { [Key in string]?: JsonValue }

/**
Matches a JSON array.
*/
export type JsonArray = JsonValue[]

/** 
Matches any valid JSON primitive value.
*/
export type JsonPrimitive = string | number | boolean | null

/**
Matches any valid JSON value.
@see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.
*/
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type PrismaJson = Prisma.NullTypes.JsonNull | Prisma.InputJsonValue
