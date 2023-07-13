import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { Page } from './_app'
import { api } from '../utils/api'
import ErrorTemplate from '../components/ErrorTemplate'
import Spinner from '../components/Spinner'
import { TbGift } from 'react-icons/tb'
import Bubble from '../components/Bubble'

const Feed: Page = () => {
  const [autoAnimate] = useAutoAnimate()

  const { data, isLoading, isError, error } = api.user.getFeed.useQuery(
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
        <TbGift className='h-8 w-8 flex-shrink-0' />
        <span>
          You feed contains a mix of messages from subscribed channels and
          private chats.
        </span>
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

Feed.title = 'For you'

export default Feed
