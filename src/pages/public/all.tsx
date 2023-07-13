import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { Page } from '../_app'
import { api } from '../../utils/api'
import ErrorTemplate from '../../components/ErrorTemplate'
import Spinner from '../../components/Spinner'
import { MdInbox } from 'react-icons/md'
import Bubble from '../../components/Bubble'

const PublicAll: Page = () => {
  const [autoAnimate] = useAutoAnimate()

  const { data, isLoading, isError, error } = api.squeal.getAll.useQuery(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  if (isError)
    return (
      <ErrorTemplate
        message={error.message}
        statusCode={error.data?.httpStatus}
      />
    )

  if (isLoading) return <Spinner />

  return (
    <>
      <div className='mb-10 mt-8 flex items-center gap-4'>
        <MdInbox className='h-8 w-8 flex-shrink-0' />
        <span>All the squeals sent in different channels.</span>
      </div>

      <div className='flex flex-col gap-4' ref={autoAnimate}>
        {data.map((squeal) => (
          <Bubble
            key={squeal.id}
            squeal={squeal as any}
            origin={squeal.channel.name}
          />
        ))}
      </div>
    </>
  )
}

PublicAll.title = 'Free for all'

export default PublicAll
