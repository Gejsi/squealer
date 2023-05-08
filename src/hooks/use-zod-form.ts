import { zodResolver } from '@hookform/resolvers/zod'
import type { UseFormProps } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema
  }
) {
  return useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so `.transform()`s can be used on the schema without
      // having the same transform getting applied again when it reaches the server
      raw: true,
    }),
  })
}

export default useZodForm
